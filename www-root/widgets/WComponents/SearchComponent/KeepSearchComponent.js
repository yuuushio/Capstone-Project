import {GmailAdapter} from "../../../Utilities/lib/ooGAPIAmalgamation.js";
import {ActiveSearchComponent} from "./ActiveSearchComponent.js";

export class KeepSearchComponent extends ActiveSearchComponent {

    /**
     * Generates a search URL given a template URL and the search term
     * @param url {String}
     * @param searchTerm {String}
     * @returns {Promise<String>}
     */
    async generateSearchURL(url, searchTerm) {
        const address = await GmailAdapter.getEmailAddress();
        const user_url = url.replace('0', address);
        const escapedSearchTerm = searchTerm.replace(/ /gi, '%252C');
        return user_url.replace('$1', escapedSearchTerm);
    }

}