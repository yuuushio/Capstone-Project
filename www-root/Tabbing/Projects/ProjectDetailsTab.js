// Project Details Tab
// Abstract class
// This implements some common logic for creating or editing projects.
import { projectDetailsTabHTMLTemplate } from "./ProjectDetailsTabHTML.js";
import { ClosableTab } from "../ClosableTab.js";
export class ProjectDetailsTab extends ClosableTab {
    constructor(name) {
        super(name);
        this.contentElement.innerHTML += projectDetailsTabHTMLTemplate;
        this.contentElement.classList.add('gr-project-details-tab');
        this._identifyInputElements();
        setTimeout(() => {
            this.postAsyncConstructionSetup();
        }, 0);
    }
    /**
     * This is a stub function for appending action, which can be overridden by subclasses.
     */
    postAsyncConstructionSetup() {
    }
    _identifyInputElements() {
        this.nameInput = this.$gse('.gr-project-tab-input-name');
        this.colourInput = this.$gse('.gr-project-tab-input-colour');
        this.calendarCheckbox = this.$gse('.gr-project-tab-input-create-calendar');
    }
    getInputData() {
        const result = {
            name: this.nameInput.value,
            colour: this.colourInput.value,
            createCalendar: this.calendarCheckbox.checked
        };
        ProjectDetailsTab.verifyInput(result);
        return result;
    }
    /**
     * Verifies whether a userInput is valid or not
     * Throws an exception if it's invalid
     * @param userInput - the user input to verify
     * @protected
     */
    static verifyInput(userInput) {
        if (userInput.name.trim().length === 0 ||
            userInput.colour.trim().length === 0) {
            throw new Error('Invalid data');
        }
    }
}
