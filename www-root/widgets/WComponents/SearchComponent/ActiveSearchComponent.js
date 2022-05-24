import {SearchComponent} from "./SearchComponent.js";
import {GmailAdapter} from "../../../Utilities/lib/ooGAPIAmalgamation.js";

export class ActiveSearchComponent extends SearchComponent {

    /*type{String}*/
    urlTemplate

    constructor(urlTemplate) {
        super();
        this.urlTemplate = urlTemplate;
        const img = document.createElement('img');
        img.src = "https://static.riley.love/gsuite-redux/icons/search-icon.png";
        img.classList.add("gr-sicon");
        const button = this.element.querySelector('.gr-search');
        button.insertAdjacentElement('beforeend', img);
        button.style.cursor = "pointer";
    }

    async onClick() {

        // retrieve the search term
        const searchTerm = window.prompt('Search term?');
        if (!searchTerm) {
            console.warn('Cancelled by user');
            return;
        }

        // open a new tab to perform search
        const url = await this.generateSearchURL(this.urlTemplate, searchTerm);
        window.open(url, '_blank', 'noopener');
    }

    /**
     * Generates a search URL given a template URL and the search term
     * @param url {String}
     * @param searchTerm {String}
     * @returns {Promise<String>}
     */
    async generateSearchURL(url, searchTerm) {
        const address = await GmailAdapter.getEmailAddress();
        const user_url = url.replace('0', address);
        const escapedSearchTerm = searchTerm.replace(/ /gi, '+');
        return user_url.replace('$1', escapedSearchTerm);
    }

}