import {GmailAdapter, GoogleAuthCallbacks, GoogleAuthManager} from "../../Utilities/lib/ooGAPIAmalgamation.js";
import {GmailComposeComponent} from "../WComponents/ComposeComponent/GmailComposeComponent.js";
import {GAppWidget} from "../GAppWidget.js";
import {ActiveSearchComponent} from "../WComponents/SearchComponent/ActiveSearchComponent.js";

const GMAIL_COMPOSE_URL = 'https://mail.google.com/mail/u/0/#inbox?compose=new&gr-redirect=no';
const GMAIL_SEARCH_URL_TEMPLATE = 'https://mail.google.com/mail/u/0/#search/$1?gr-redirect=no';

export class GMailWidget extends GAppWidget {

    constructor() {

        super([
            new ActiveSearchComponent(GMAIL_SEARCH_URL_TEMPLATE),
            new GmailComposeComponent()
        ]);

        GoogleAuthCallbacks.listenToLogIn(this.initialiseUnread.bind(this));
        GoogleAuthCallbacks.listenToLogOut(this.resetViewButton.bind(this));

    }

    get name() {
        return "GMail";
    }

    get targetURL() {
        return "https://mail.google.com/mail/u/0/?gr-redirect=no";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/icons/gmail.png";
    }

    get subtypeCSSClassName() {
        return "gr-gmail-widget";
    }

    async initialiseUnread() {

        const viewButton = this.element.querySelector('.gr-view');

        // store old view button text
        if (!this.oldViewButtonText) {
            this.oldViewButtonText = viewButton.innerText;
        }

        if (GoogleAuthManager.signedIn) {
            const unreadCount = await getUnreadCount();
            if (unreadCount > 0) {
                viewButton.innerText = unreadCount.toString();
            }
        }

    }

    async resetViewButton() {
        if (this.oldViewButtonText) {
            const viewButton = this.element.querySelector('.gr-view');
            viewButton.innerText = this.oldViewButtonText;
        }
    }
}

/**
 * Gets the user's unread email count
 * @returns {Promise<number>}
 */
async function getUnreadCount() {

    const list = await GmailAdapter.getUnreadEmails();
    return list.length;

}