// Create Project dynamic tab
// This one allows the user to type in details of a new project to create

import {ProjectDetailsTab} from "./ProjectDetailsTab.js";
import {Project} from "../../Projects/Project.js";
import {ProjectManager} from "../../Projects/ProjectManager.js";

export class CreateProjectTab extends ProjectDetailsTab {

    submissionButton!: HTMLButtonElement;
    project: Project | null = null;

    constructor(name: string = "Creating New Project") {
        super(name);
        this._addTabSpecificHTML();
    }

    private _addTabSpecificHTML() {
        this.$gse('h3').innerText = 'Create a new project';
        this.contentElement.insertAdjacentHTML('beforeend', additionalHTMLCode);
        this.submissionButton = <HTMLButtonElement> this.$gse('#gr-create-project-submit-button');
        this.submissionButton.addEventListener('click', this.submissionButtonOnClick.bind(this));

        //close button next to submit
        const closeElement = this.contentElement.querySelector(".gr-tab-button-close")!;
        closeElement.addEventListener('click', (event) => {
            event.stopPropagation();
            this.onCloseButtonClick();
        });
    }

    async submissionButtonOnClick(): Promise<void> {

        // say we're doing it
        this.submissionButton.innerText = 'Submitting...';

        try {

            const userInput = this.getInputData();
            await ProjectManager.createProject(userInput.name, userInput.colour, userInput.createCalendar);
            await ProjectManager.commitChanges();
            this.submissionButton.innerText = 'submitted.';
            this.submissionButton.disabled = true;

            // close self
            this.onCloseButtonClick();

        } catch (e) {
            this.submissionButton.innerText = 'Submit';
            window.alert("Error: " + JSON.stringify(e));
            throw e;
        }

    }

}

const additionalHTMLCode = `
<p class="gr-sub-cancel-para">
    <button id="gr-create-project-submit-button" class="btn btn-primary">Submit</button>
    <button class="gr-tab-button-close">Cancel</button>
</p>
`;