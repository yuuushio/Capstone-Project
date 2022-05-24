// Calendar Event Class
// Represents individual events in a calendar
// Just a glorified struct

class CalendarEvent {

    /**
     * Default constructor of CalendarEvent
     * @param id {string} google defined ID
     * @param name {string} user friendly name of event
     * @param startTime {Date}
     * @param endTime {Date}
     * @param calendar {GoogleCalendar} calendar instance
     */
    constructor(id, name, startTime, endTime, calendar) {
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.calendar = calendar;
    }

}

// API Key Data

const GAPIKeys = {
    clientId: '2419057459-agqcokadkoqle11ue9l3dls3cdcn4kdn.apps.googleusercontent.com',
    apiKey: 'AIzaSyBju8VbF8uC9rK4AkV-uguQcNbEI7zQmJ0',
    discoveryDocs: {
        gmail: "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
        calendar: "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        docs: "https://content.googleapis.com/discovery/v1/apis/docs/v1/rest",
        sheets: "https://sheets.googleapis.com/$discovery/rest?version=v4",
        slides: "https://content.googleapis.com/discovery/v1/apis/slides/v1/rest",
        drive: "https://content.googleapis.com/discovery/v1/apis/drive/v3/rest"
    },
    scopes: [
        'https://mail.google.com',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/presentations',
        'https://www.googleapis.com/auth/drive.appdata'
    ]
};

// Module for managing callbacks to signIn and signOut events

const logInCallbacks = [];
const logOutCallbacks = [];

class GoogleAuthCallbacks {

    /**
     * Register a listener to login
     * @param callback {function}
     */
    static listenToLogIn(callback) {
        logInCallbacks.push(callback);
    }

    /**
     * Register a listener to log out
     * @param callback {function}
     */
    static listenToLogOut(callback) {
        logOutCallbacks.push(callback);
    }

    static callAllCallbacks(list) {
        list.forEach(item => item());
    }

    /**
     * Fires event on Log In
     */
    static emitLogInEvent() {
        this.callAllCallbacks(logInCallbacks);
    }

    /**
     * Fires event on Log Out
     */
    static emitLogOutEvent() {
        this.callAllCallbacks(logOutCallbacks);
    }

}

// Google Auth Manager

let authInstance;

/**
 * Loads GAPI script in the browser by injecting a tag
 * @returns {Promise<>}
 */
async function loadGAPIScript() {

    await new Promise((resolve, reject) => {

        const tag = document.createElement('script');
        tag.src = 'https://apis.google.com/js/api.js';
        tag.onload = () => {resolve(tag);};

        document.head.appendChild(tag);

    });

    await new Promise((resolve, reject) => {
        gapi.load('client:auth2', () => resolve());
    });

}


class GoogleAuthManager {

    static async initialise() {

        try {
            gapi;
        } catch (e) {
            await loadGAPIScript();
        }

        await gapi.client.init({
            apiKey: GAPIKeys.apiKey,
            clientId: GAPIKeys.clientId,
            discoveryDocs: Object.values(GAPIKeys.discoveryDocs),
            scope: GAPIKeys.scopes.join(' ')
        });

        authInstance = gapi.auth2.getAuthInstance();

        // try to fire the first events
        if (this.signedIn) {
            GoogleAuthCallbacks.emitLogInEvent();
        } else {
            GoogleAuthCallbacks.emitLogOutEvent();
        }

    }

    static get signedIn() {
        return authInstance.isSignedIn.get();
    }

    static async logIn() {

        if (this.signedIn) {
            console.warn("Already logged in");
            return;
        }

        await authInstance.signIn();
        GoogleAuthCallbacks.emitLogInEvent();

    }

    static async logOut() {

        if (!this.signedIn) {
            console.warn('Already logged out');
            return;
        }

        await authInstance.signOut();
        GoogleAuthCallbacks.emitLogOutEvent();

    }

}

// Google Calendar Classes

/**
 * Gets a CalendarEvent object from raw return from Google API
 * @param junk {Object} whatever that is returned from Google
 * @param calendar {GoogleCalendar} the calendar that it belongs to
 * @returns {CalendarEvent} (null for cancelled events)
 */
function distillCalendarEvent(junk, calendar) {

    // sanity check
    if (junk.kind !== 'calendar#event') {
        throw new TypeError('Invalid calendar event return');
    }

    if (junk.status === 'cancelled') {
        return null;
    }

    return new CalendarEvent(
        junk.id,
        junk.summary,
        new Date(junk.start.dateTime || junk.start.date),
        new Date(junk.end.dateTime || junk.end.date),
        calendar
    );

}

class GoogleCalendar {

    /**
     * GoogleCalendar class: struct.
     * @param id {string} Google's ID
     * @param name {string} user friendly name
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Gets all events as a list
     * @returns {Promise<CalendarEvent[]>}
     */
    async getEventList() {

        const rawResponse = await gapi.client.calendar.events.list({
            calendarId: this.id
        });
        const result = rawResponse.result;

        const allJunkItems = result.items;
        return allJunkItems.map(junkItem => {
            return distillCalendarEvent(junkItem, this)
        }).filter(item => Boolean(item));

    }

    /**
     * Adds an event to the calendar and push it online
     * @param newEvent {CalendarEvent}
     * @returns {Promise<CalendarEvent>} an event that was created. will be a fresh one
     * Exploratory QA passed 2020-10-01
     */
    async addEvent(newEvent) {

        const param = {
            end: {
                dateTime: newEvent.endTime.toISOString()
            },
            start: {
                dateTime: newEvent.startTime.toISOString()
            },
            summary: newEvent.name
        };

        const response = await new Promise((resolve, reject) => {
            const request = gapi.client.calendar.events.insert({
                calendarId: this.id,
                resource: param
            });
            request.execute(response => {
                resolve(response);
            });
        });

        return distillCalendarEvent(response.result, this);

    }

    /**
     * Removes an event from this calendar
     * @param {CalendarEvent} eventToRemove
     * @returns {Promise<>}
     */
    async removeEvent(eventToRemove) {
        // TODO
    }

}

// Other calendar methods

/**
 * Distill meaningful items from information that came from Google's API
 * @param junk {Object} whatever's returned from Google
 */
function distillCalendar(junk) {

    // sanity check
    const kind = junk.kind;
    if (kind !== 'calendar#calendarListEntry' && kind !== 'calendar#calendar') {
        throw new TypeError('Invalid calendar object');
    }

    return new GoogleCalendar(junk.id, junk.summary);

}

class CalendarAdapter {

    /**
     * Returns all calendars of a user
     * @returns {Promise<GoogleCalendar[]>}
     */
    static async getAllCalendars() {

        // query Google API to get response
        const response = await gapi.client.calendar.calendarList.list();
        const rawCalendarJunks = response.result.items;

        return rawCalendarJunks.map(junkItem => distillCalendar(junkItem));

    }

    /**
     * Gets a calendar by its Google ID
     * @param id {string} Google defined ID
     * @returns {Promise<GoogleCalendar>}
     */
    static async getCalendarById(id) {

        const junkItem = (await gapi.client.calendar.calendarList.get({
            calendarId: id
        })).result;

        return distillCalendar(junkItem);

    }

    /**
     * Create a new calendar
     * @param {string} name - name of new calendar
     * @returns {Promise<GoogleCalendar>}
     * Exploratory QA passed 2020-11-13
     */
    static async createCalendar(name) {

        const response = await gapi.client.calendar.calendars.insert({
            summary: name
        });

        return distillCalendar(response.result);

    }

    /**
     * Removes a calendar from the account
     * @param {GoogleCalendar} calendarToRemove
     * @returns {Promise<void>}
     * Exploratory QA passed 2020-11-13
     */
    static async removeCalendar(calendarToRemove) {
        await this.removeCalendarById(calendarToRemove.id);
    }

    /**
     * Removes a calendar by calendarId
     * @param id {string} - GAPI-defined ID string
     * @returns {Promise<void>}
     * Exploratory QA passed 2020-11-13
     */
    static async removeCalendarById(id) {
        await gapi.client.calendar.calendars.delete({
            calendarId: id
        });
    }

}

// Email Class

/**
 * @private
 */
class DataParser {

    static _parseFrom(rawGAPIObj) {
        return this._extractHeaderValue(rawGAPIObj, 'From');
    }

    static _parseTo(rawGAPIObj) {
        return this._extractHeaderValue(rawGAPIObj, 'To');
    }

    static _parseSubject(rawGAPIObj) {
        return this._extractHeaderValue(rawGAPIObj, 'Subject');
    }

    static _extractHeaderValue(rawGAPIObj, headerName) {

        /** @type {Object[]} */
        const headerArray = rawGAPIObj.payload.headers;
        const fromHeaderArray = headerArray.filter(obj => {
            return obj.name === headerName;
        });

        return fromHeaderArray.length > 0 ? fromHeaderArray[0].value : null;

    }

}

class Email {

    /** @type {Object} */
    rawGAPIObject = null
    /** @type {string[]} */
    labelIds = null

    /**
     * Default constructor for a thin Email wrapper.
     * @param messageId {string} GAPI defined messageId
     * @param threadId {string} GAPI defined threadId
     */
    constructor(messageId, threadId) {
        this.messageId = messageId;
        this.threadId = threadId;
    }

    async _getMoreInfoFromGAPI() {
        if (!this.rawGAPIObject) {
            const response = await gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: this.messageId
            });
            this.rawGAPIObject = response.result;
        }
    }

    /**
     * Gets the "from" field of this email
     * @returns {Promise<string>}
     */
    async getFrom() {
        await this._getMoreInfoFromGAPI();
        return DataParser._parseFrom(this.rawGAPIObject);
    }

    /**
     * Gets the "to" field of this email
     * @returns {Promise<string>}
     */
    async getTo() {
        await this._getMoreInfoFromGAPI();
        return DataParser._parseTo(this.rawGAPIObject);
    }

    /**
     * Gets the "Subject" field
     * @returns {Promise<string>}
     */
    async getSubject() {
        await this._getMoreInfoFromGAPI();
        return DataParser._parseSubject(this.rawGAPIObject);
    }

    /**
     * Gets the "snippet" field
     * @returns {Promise<string>}
     */
    async getSnippet() {
        await this._getMoreInfoFromGAPI();
        return this.rawGAPIObject.snippet;
    }

    /**
     * Get a list of labels of this message, in their Ids
     * @returns {Promise<string[]>}
     */
    async getLabelIds() {
        if (!this.labelIds) {
            await this._getMoreInfoFromGAPI();
            this.labelIds = [...this.rawGAPIObject.labelIds];
        }
        return this.labelIds;
    }

    /**
     * Add labels to this email
     * @param labelIds {string[]} the GAPI id of the labels
     * @returns {Promise<void>}
     */
    async addLabelsById(labelIds) {

        // sanity check
        // warn and return if all labels already exists
        const existingLabels = await this.getLabelIds();
        if (labelIds.every(item => existingLabels.includes(item))) {
            console.warn('Trying to add a duplicate label?');
            return;
        }

        const response = await gapi.client.gmail.users.messages.modify({
            userId: 'me',
            id: this.messageId,
            addLabelIds: labelIds
        });

        this.labelIds = [...response.result.labelIds];

    }

    /**
     * Remove labels from the email
     * @param labelIds {string[]} the GAPI id of the label
     * @returns {Promise<void>}
     */
    async removeLabelById(labelIds) {

        // sanity check
        // warn and return if all labels already exists
        const existingLabels = await this.getLabelIds();
        if (labelIds.every(item => !existingLabels.includes(item))) {
            console.warn('Trying to remove a label that isn\'t already in?');
            return;
        }

        const response = await gapi.client.gmail.users.messages.modify({
            userId: 'me',
            id: this.messageId,
            removeLabelIds: labelIds
        });

        this.labelIds = [...response.result.labelIds];

    }

    /**
     * Add labels to this email
     * @param labels {Label[]}
     * @returns {Promise<void>}
     */
    async addLabel(labels) {
        await this.addLabelsById(labels.map(item => item.id));
    }

    /**
     * Remove labels from this email
     * @param labels {Label[]}
     * @returns {Promise<void>}
     */
    async removeLabel(labels) {
        await this.removeLabelById(labels.map(item => item.id));
    }

    /**
     * Get whether this email is unread
     * @returns {Promise<boolean>}
     */
    async isUnread() {
        const labels = await this.getLabelIds();
        return labels.includes('UNREAD');
    }

    /**
     * Mark this email as read
     * @returns {Promise<void>}
     */
    async markAsRead() {

        // sanity check
        if (await this.isUnread() === false) {
            console.warn('Marking a read email as read again?');
            return;
        }

        await this.removeLabelById(['UNREAD']);

    }

    /**
     * Mark this email as unread
     * @returns {Promise<void>}
     */
    async markAsUnread() {

        // sanity check
        if (await this.isUnread() === true) {
            console.warn('Marking an unread email as unread?');
            return;
        }

        await this.addLabelsById(['UNREAD']);

    }

    /**
     * Move this email to trash
     * @returns {Promise<void>}
     */
    async trash() {
        await gapi.client.gmail.users.messages.trash({
            userId: 'me',
            id: this.messageId
        });
    }

}

/**
 * Extract a list of Emails from GAPI's response
 * @param rawResults {Object}
 * @returns {Email[]}
 */
function distillGAPIEmailList(rawResults) {

    /** @type {Object[]} */
    const messageArray = rawResults.result.messages;
    if (messageArray === undefined) {
        return undefined;
    }
    const allMessageIds = messageArray.map(obj => obj.id);
    const allMessageThreadIds = messageArray.map(obj => obj.threadId);

    const result = [];
    for (let i = 0; i < messageArray.length; ++i) {
        const thisId = allMessageIds[i];
        const thisThreadId = allMessageThreadIds[i];
        result.push(new Email(thisId, thisThreadId));
    }
    return result;

}

// Label Class

class Label {

    /** @type {Object} */
    rawGAPIObject

    /**
     * Constructor
     * @param id {string} defined by GAPI
     * @param name {string} defined by GAPI
     */
    constructor(id, name) {

        // detect duplicates
        if (getLabelById(id)) {
            console.warn(`Trying to create duplicate Label of ID: ${id}`);
        }

        this.id = id;
        this.name = name;

        // register this instance
        allLabels[id] = this;

    }

    /** @returns {Promise<number>} */
    async getMessagesTotal() {

    }

    /** @returns {Promise<number>} */
    async getMessagesUnread() {

    }

}

/**
 * Distills a label from raw GAPI response
 * @param rawLabelObject {Object} raw response from gapi (one of response.result.labels array)
 * @returns {Label}
 */
function distillLabel(rawLabelObject) {

    const thisId = rawLabelObject.id;
    const cachedInstance = getLabelById(thisId);

    // try getting it by ID from the label module
    if (cachedInstance) {
        return cachedInstance;
    }

    // else create new
    const thisName = rawLabelObject.name;
    return new Label(thisId, thisName);

}

/**
 * id => Label
 * @type {{string : Label}}
 **/
const allLabels = {};

/**
 * Gets label by Id
 * @param id {string} GAPI defined ID
 * @returns {Label}
 */
function getLabelById(id) {
    return allLabels[id];
}

// GAPI Adapter

class GAPIAdapter {

    constructor() {
        if (!GoogleAuthManager.signedIn) {
            throw new Error('Not signed in with GoogleAuthManager.');
        }
    }

}

// GMail Adapter

/** @type {Email[]} */
let cachedEmailList = [];
/** @type {Label[]} */
let cachedLabelList = [];

class GmailAdapter extends GAPIAdapter {

    /**
     * Get the user's email address
     * @returns {Promise<String>}
     */
    static async getEmailAddress() {
        const email = await gapi.client.gmail.users.getProfile({
            "userId": "me"
        });
        return email.result.emailAddress;
    }

    /**
     * Create and return a URL for the user to compose a new email
     * @returns {Promise<string>}
     */
    static async getComposeURL() {
        const address = await this.getEmailAddress();
        return 'https://mail.google.com/mail/u/' + address + '/#inbox?compose=new';
    }

    /**
     * Opens a new tab where the user can compose a new email
     */
    static async openComposeURL() {
        let url = await this.getComposeURL();
        window.open(url, '_blank', 'noopener');
    }

    /**
     * Get all the user's emails
     * @param nMessages {number} Optional param about how many to get
     * @returns {Promise<Email[]>}
     */
    static async getEmailList(nMessages = 500) {

        if (!cachedEmailList) {
            const rawResults = await gapi.client.gmail.users.messages.list({userId: 'me', maxResults: nMessages});
            cachedEmailList = distillGAPIEmailList(rawResults);
        }

        return cachedEmailList;

    }

    /**
     * Cached method to get an email from Gmail API
     * @param id {string} gmail id
     * @returns {Promise<Email>}
     */
    static async getEmailById(id) {

        const emails = await this.getEmailList();
        return emails.filter(email => email.messageId === id)[0];

    }

    /**
     * Gets a list of all labels under the user's account
     * @returns {Promise<Label[]>}
     */
    static async getLabelList() {

        if (!cachedLabelList) {
            const response = await gapi.client.gmail.users.labels.list({
                userId: 'me'
            });
            const rawLabelList = response.result.labels;
            cachedLabelList = rawLabelList.map(distillLabel);
        }

        return cachedLabelList;

    }

    /**
     * Gets a list of email that has a particular label
     * @param label {Label}
     * @returns {Promise<Email[]>}
     */
    static async getEmailListByLabel(label) {

        const queryString = `label:${label.name}`;
        return await this.getEmailByQueryString(queryString);

    }

    /**
     * Searches for emails with gmail's query parameter
     * For more information about the query string, visit https://support.google.com/mail/answer/7190
     * @param queryString {string} query string for Google API.
     * @returns {Promise<[]>}
     */
    static async getEmailByQueryString(queryString) {

        const rawResults = await gapi.client.gmail.users.messages.list({
            maxResults: 500,
            userId: 'me',
            q: queryString
        });
        return distillGAPIEmailList(rawResults);

    }

    /**
     * Gets all unread emails
     * @returns {Promise<Email[]>}
     */
    static async getUnreadEmails() {
        return await this.getEmailByQueryString('label:UNREAD');
    }

    /**
     * Creates a new label into the account
     * @param name {string}
     * @returns {Promise<Label>}
     * Exploratory QA passed 2020-10-06
     */
    static async createNewLabel(name) {

        const response = await gapi.client.gmail.users.labels.create({
            userId: 'me',
            resource: {
                name,
                labelListVisibility: 'labelShow',
                messageListVisibility: 'show'
            }
        });

        const result = new Label(response.result.id, response.result.name);
        cachedLabelList.push(result);
        return result;

    }

    /**
     * Removes a label from the account
     * @param {Label} labelToRemove
     */
    static async removeLabel(labelToRemove) {
        await this.removeLabelById(labelToRemove.id);
    }

    /**
     * Removes a label by its ID
     * @param id {string} gapi-defined ID
     * @returns {Promise<void>}
     */
    static async removeLabelById(id) {

        await gapi.client.gmail.users.labels.delete({
            userId: 'me',
            id
        });

        // remove this one from cachedLabelList
        cachedLabelList = cachedLabelList.filter(item => item.id !== id);

    }

    static invalidateCaches() {
        cachedLabelList = [];
        cachedEmailList = [];
    }

}

// Google Drive Adapter

class GDocsAdapter extends GAPIAdapter {

    /**
     * Creates a new google document in the user's home folder and
     * returns its document id.
     * @abstract
     * @returns {Promise<String>}
     */
    static async createDoc() {

    }

    /**
     * Creates a link to a newly made google document in the user's home folder
     * @abstract
     * @returns {Promise<String>}
     */
    static async createDocLink() {

    }

    /**
     * Opens a new google document in a new tab
     * @abstract
     */
    static async openNewDoc() {

    }

}

class DocsAdapter extends GDocsAdapter {

    /**
     * Creates a new google doc in the user's home folder and
     * returns its document id.
     * @returns {Promise<String>}
     */
    static async createDoc() {
        const rawResult = await gapi.client.docs.documents.create({"resource": {}});
        return rawResult.result.documentId;
    }

    /**
     * Creates a link to a newly made google doc in the user's home folder
     * @returns {Promise<String>}
     */
    static async createDocLink() {
        let id = await DocsAdapter.createDoc();
        return "https://docs.google.com/document/d/" + id + "/";
    }

    /**
     * Opens a new google doc in a new tab
     */
    static async openNewDoc() {
        let url = await DocsAdapter.createDocLink();
        window.open(url, '_blank', 'noopener');
    }

}

class SheetsAdapter extends GDocsAdapter {

    /**
     * Creates a new google spreadsheet in the user's home folder and
     * returns its document id.
     * @returns {Promise<String>}
     */
    static async createDoc() {
        const rawResult = await gapi.client.sheets.spreadsheets.create({"resource": {}});
        return rawResult.result.spreadsheetId;
    }

    /**
     * Creates a link to a newly made google spreadsheet in the user's home folder
     * @returns {Promise<String>}
     */
    static async createDocLink() {
        const rawResult = await gapi.client.sheets.spreadsheets.create({"resource": {}});
        return rawResult.result.spreadsheetUrl;
    }

    /**
     * Opens a new google spreadsheet in a new tab
     */
    static async openNewDoc() {
        let url = await SheetsAdapter.createDocLink();
        window.open(url, '_blank', 'noopener');
    }

}

class SlidesAdapter extends GDocsAdapter {

    /**
     * Creates a new google presentation in the user's home folder and
     * returns its document id.
     * @returns {Promise<String>}
     */
    static async createDoc() {
        const rawResult = await gapi.client.slides.presentations.create({"resource": {}});
        return rawResult.result.presentationId;
    }

    /**
     * Creates a link to a newly made google presentation in the user's home folder
     * @returns {Promise<String>}
     */
    static async createDocLink() {
        let id = await SlidesAdapter.createDoc();
        return "https://docs.google.com/presentation/d/" + id + "/edit";
    }

    /**
     * Opens a new google presentation in a new tab
     */
    static async openNewDoc() {
        let url = await SlidesAdapter.createDocLink();
        window.open(url, '_blank', 'noopener');
    }

}

// Google Drive Adapter

class GDriveAdapter extends GAPIAdapter {

    static async getAppDataFileIDsByName(name) {
        return gapi.client.drive.files
            .list({
                q: "name='" + name + "'",
                spaces: 'appDataFolder',
                fields: 'files(id)'
            }).then(
                function(data) {
                    var ids = [];
                    data.result.files.forEach((file) => {
                        ids.push(file.id);
                    });
                    return ids;
                }
            );
    }

    /**
     * Returns a list of all files in the appDataFolder in the format
     * {id, name}
     * @returns {Promise<[{id: *, name: *}]>}
     */
    static listAppDataFiles() {
        return gapi.client.drive.files
            .list({
                spaces: 'appDataFolder',
                fields: 'files(id, name)'
            }).then(
                function(data) {
                    return data.result.files;
                }
            );
    }

    /**
     * Creates a new blank file into the appDataFolder.
     * Use the saveAppData function to overwrite its contents.
     * Returns the id of the new file.
     * @param name {String} the name of the file, without an extension (.json)
     * @returns {Promise<String>}
     */
    static createAppDataFile(name) {
        return gapi.client.drive.files
            .create({
                resource: {
                    name: name,
                    parents: ['appDataFolder']
                },
                fields: 'id'
            }).then(function (data) {
                return data.result.id;
            });
    }

    /**
     * Overwrites the contents of the specified file.
     * @param fileId {String} the id of the file
     * @param appData {JSON} the new contents of the file
     * @returns {Promise<{id: *, name: *}>}
     */
    static saveAppData(fileId, appData) {
        return gapi.client.request({
            path: '/upload/drive/v3/files/' + fileId,
            method: 'PATCH',
            params: {
                uploadType: 'media'
            },
            body: JSON.stringify(appData)
        }).then(function(data) {
            return {
                id: data.result.id,
                name: data.result.name
            }
        });
    };

    /**
     * Retrieves the contents of a file
     * @param fileId {String} id of the file
     * @returns {Promise<JSON>}
     */
    static getAppDataFileContent(fileId) {
        return gapi.client.drive.files
            .get({
                fileId: fileId,
                alt: 'media'
            }).then(function (data) {
                return data.result;
            });
    };

    /**
     * Deletes the file with the given id. Returns true if successful.
     * @param fileId {String} id of the file
     * @returns {Promise<boolean>}
     */
    static deleteAppDataFile(fileId) {
        return gapi.client.drive.files.delete({
            fileId: fileId
        }).then(function() {
            return true;
        }, function() {
            return false; // catch any errors
        });
    }

}

export { CalendarAdapter, CalendarEvent, DocsAdapter, Email, GAPIKeys, GDriveAdapter, GmailAdapter, GoogleAuthCallbacks, GoogleAuthManager, GoogleCalendar, Label, SheetsAdapter, SlidesAdapter, getLabelById };
