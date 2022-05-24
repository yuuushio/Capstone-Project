import {GmailAdapter} from "../../Utilities/lib/ooGAPIAmalgamation.js";

export class WComponent {

    /*type{HTMLElement}*/
    element = document.createElement('div');

    /**
     * Performs this operation when the component is clicked upon.
     * @abstract
     */
    async onClick() {}

    /**
     * Helper method.
     * Adjusts the given url so that it matches the current user's account.
     * @param url {String}
     * @returns {Promise<String>}
     */
    async createUserURL(url) {
        const address = await GmailAdapter.getEmailAddress();
        return url.replace('0', address);
    }

    /**
     * Helper method.
     * Opens the given url in with the current user's account.
     * @param url {String}
     * @returns {Promise<String>}
     */
    async openUserURL(url) {
        const newUrl = await this.createUserURL(url);
        window.open(newUrl, '_blank', 'noopener');
    }

}