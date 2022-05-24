import {ActiveSearchComponent} from "./ActiveSearchComponent.js";
import {GmailAdapter} from "../../../Utilities/lib/ooGAPIAmalgamation.js";

export class AppsScriptSearchComponent extends ActiveSearchComponent {

    /**
     * Generates a search URL given a template URL and the search term
     * @param url {String}
     * @param searchTerm {String}
     * @returns {Promise<String>}
     */
    async generateSearchURL(url, searchTerm) {
        const address = await GmailAdapter.getEmailAddress();
        const user_url = url.replace('0', address);
        const escapedSearchTerm = searchTerm.replace(/ /gi, '%20');
        return user_url.replace('$1', escapedSearchTerm);
    }

}