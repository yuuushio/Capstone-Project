// The Project Class
// @ts-ignore
import { GmailAdapter, GoogleCalendar, Label } from '../Utilities/lib/ooGAPIAmalgamation.js';
export class Project {
    constructor(name, colour, label, calendar) {
        this._updateCallback = null;
        this.name = name;
        this.colour = colour;
        this.label = label;
        this.calendar = calendar;
        this.id = uuidv4();
    }
    /**
     * Gets all emails related to this project
     */
    async getAllEmails() {
        return await new GmailAdapter().getEmailByQueryString(`label:${this.label.id}`);
    }
    /**
     * Gets all calendar events related to this project
     */
    async getAllCalendarEvents() {
        if (!this.calendar) {
            throw new Error('This project has no calendar associated with it.');
        }
        return await this.calendar.getEventList();
    }
    /**
     * Commits the change and save to LocalStorage
     */
    commit() {
        if (this._updateCallback) {
            this._updateCallback(this);
        }
    }
    serialise() {
        let calendarObject = this._serialiseCalendar();
        let labelObject = this._serialiseLabel();
        return {
            calendar: calendarObject,
            colour: this.colour,
            id: this.id,
            label: labelObject,
            name: this.name
        };
    }
    _serialiseCalendar() {
        let calendarObject = null;
        if (this.calendar) {
            calendarObject = {
                type: "gr-calendar-label",
                name: this.calendar.name,
                id: this.calendar.id
            };
        }
        return calendarObject;
    }
    static _deSerialiseCalendar(calendarObject) {
        return new GoogleCalendar(calendarObject.id, calendarObject.name);
    }
    _serialiseLabel() {
        return {
            type: "gr-gmail-label",
            id: this.label.id,
            name: this.label.name
        };
    }
    static _deSerialiseLabel(labelObject) {
        return new Label(labelObject.id, labelObject.name);
    }
    static generateFromSerialised(object) {
        // extract label and calendar
        const newLabel = this._deSerialiseLabel(object.label);
        const newCalendar = object.calendar == null ? null : this._deSerialiseCalendar(object.calendar);
        // okay
        return new Project(object.name, object.colour, newLabel, newCalendar);
    }
    /**
     * Make this object un-usable.
     */
    selfDestruct() {
        this.id = "0000";
    }
    /**
     * Register a modification callback
     */
    registerModificationCallback(callback) {
        this._updateCallback = callback;
    }
    /**
     * Returns whether current project's associated calendar has an event that corresponds to current time.
     * Always returns false if there is no calendar.
     */
    async hasCurrentEvent() {
        if (!this.calendar) {
            return false;
        }
        // grab all calendar events
        const events = await this.calendar.getEventList();
        for (const event of events) {
            if (_eventIsCurrent(event)) {
                return true;
            }
        }
        return false;
    }
}
// simple UUID generation function
// public domain by random StackExchange user
function uuidv4() {
    var d = new Date().getTime(); //Timestamp
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) { //Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        }
        else { //Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
function _eventIsCurrent(event) {
    const currentEpochMS = Date.now();
    const startTime = event.startTime.getTime();
    const endTime = event.endTime.getTime();
    return (startTime < currentEpochMS && endTime > currentEpochMS);
}
