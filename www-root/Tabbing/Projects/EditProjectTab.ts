// Edit Project tab

import {ProjectDetailsTab} from "./ProjectDetailsTab.js";
import {Project} from "../../Projects/Project.js";
// @ts-ignore
import {CalendarAdapter, getLabelById, GmailAdapter} from "../../Utilities/lib/ooGAPIAmalgamation.js";

export class EditProjectTab extends ProjectDetailsTab {

    project: Project;
    submitButton: HTMLElement;

    constructor(project: Project) {
        super(`Editing project ${project.name}`);
        this.project = project;
        this.contentElement.insertAdjacentHTML('beforeend', additionalHTMLCode);
        this.submitButton = this.$gse('#gr-edit-project-submit-button');
        this.submitButton.onclick = this.submitButtonOnClick.bind(this);
    }

    postAsyncConstructionSetup() {
        super.postAsyncConstructionSetup();

        // pre-fill details
        this.nameInput.value = this.project.name;
        this.colourInput.value = this.project.colour;

        // remove the checkboxes
        // @ts-ignore
        this.contentElement.querySelector('.gr-project-tab-checkboxes').style.visibility = 'hidden';

    }

    async submitButtonOnClick() {

        // modify project
        this.project.name = this.nameInput.value;
        this.project.colour = this.colourInput.value;

        // commit
        this.project.commit();

        // let user know
        this.submitButton.innerText = 'done.';
        this.onCloseButtonClick();

    }

}

const additionalHTMLCode = `
<p>
    <button id="gr-edit-project-submit-button" class="btn btn-primary">Submit</button>
</p>
`;