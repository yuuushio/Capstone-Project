import {GRWidget} from "./GRWidget.js";
import {Project} from "../Projects/Project.js";
import {ProjectManager} from "../Projects/ProjectManager.js";
import type {TabContext} from "../Tabbing/TabContext.js";
import {EditProjectTab} from "../Tabbing/Projects/EditProjectTab.js"

// @ts-ignore
import {GmailAdapter} from "../Utilities/lib/ooGAPIAmalgamation.js";

function redirectToCalendar(id: string) {
    const url = `https://calendar.google.com/calendar/u/0/embed?src=${id}`;
    window.open(url, '_blank', 'noreferral noopener');
}

export class ProjectWidget extends GRWidget {

    project: Project;
    _name: string;

    // all buttons
    infoButton!: HTMLElement;
    calendarButton!: HTMLElement;
    renameButton!: HTMLElement;
    editButton!: HTMLElement;
    trashButton!: HTMLElement;
    viewButton!: HTMLElement | null;

    addTabContextCallback: (context: TabContext) => void;
    deleteSelfCallback: (widget: ProjectWidget) => void;

    // display states: highlighting
    highlighted: boolean = false;

    /**
     * From a project object, create its corresponding project widget
     * @param project - the Project to create for
     * @param addTabContextCallback - callback function in case the widget orders creation of a new tab
     * @param deleteSelfCallback - callback function in case the widget needs to delete itself
     */
    constructor(project: Project, addTabContextCallback: (context: TabContext) => void, deleteSelfCallback: (widget: ProjectWidget) => void) {

        super();
        this.addTabContextCallback = addTabContextCallback;
        this.deleteSelfCallback = deleteSelfCallback;

        // init html elements
        this.element.innerHTML = contentHTMLTemplate;
        this.element.classList.add("gr-app-cont");
        this.element.classList.add('gr-project-widget');

        // fill in name and colour
        this.project = project;
        this._name = project.name;
        this.$gse('.gr-project-text').innerText = this.name;
        this.setColour(this.project.colour);

        // other initialisation work
        this._identifyButtonElements();
        this._addClickListeners();
        this._processHasCurrentEvent().then(/* ignored */);

    }

    /**
     * Highlight this widget if this project has a current event in it
     * @private
     */
    private async _processHasCurrentEvent() {
        if (await this.project.hasCurrentEvent()) {
            this.setHighlight(true);
        } else {
            this.setHighlight(false);
        }
    }

    private $gse(selector: string): HTMLElement {
        return <HTMLElement>this.element.querySelector(selector);
    }

    setColour(colour: string) {
        this.$gse('.gr-side-line').style.backgroundColor = colour;
        this.$gse('.gr-compose').style.backgroundColor = colour;
    }

    /**
     * Sets whether this widget is highlighted
     * @param highlight - the new highlight state
     */
    setHighlight(highlight: boolean) {
        this.highlighted = highlight;
        if (highlight) {
            this.element.classList.add('highlighted');
        } else {
            this.element.classList.remove('highlighted');
        }
    }

    get name() {
        return this._name;
    }

    /**
     * Identify button elements and assign to this one's fields
     * @private
     */
    private _identifyButtonElements() {

        // fetch all img tags
        const imageElements = this.element.querySelectorAll('img');
        const generator = (function*() {
            for (const element of imageElements) {
                yield element;
            }
        })();

        // map them one by one
        this.infoButton = <HTMLElement> generator.next().value;
        this.calendarButton = <HTMLElement> generator.next().value;
        this.renameButton = <HTMLElement> generator.next().value;
        this.editButton = <HTMLElement> generator.next().value;
        this.trashButton = <HTMLElement> generator.next().value;
        this.viewButton = <HTMLElement> this.element.querySelector('.gr-compose');
        console.log(this.viewButton);
    }

    /**
     * Adds click listener to all buttons
     * @private
     */
    private _addClickListeners() {

        // simple shorthand
        const $al = (element: HTMLElement, func: VoidFunction) => {
            element.addEventListener('click', func.bind(this));
        };

        $al(this.infoButton, this.infoButtonOnClick);
        $al(this.calendarButton, this.calendarButtonOnClick);
        $al(this.renameButton, this.renameButtonOnClick);
        $al(this.editButton, this.editButtonOnClick);
        $al(this.trashButton, this.trashButtonOnClick);
        if (this.viewButton) {
            $al(this.viewButton, this.viewButtonOnClick);
        }

    }

    infoButtonOnClick() {
        window.alert(JSON.stringify(this.project));
    }

    calendarButtonOnClick() {

        // check if a calendar exists
        if (!this.project.calendar) {
            window.alert('This project does not have an associated calendar.');
            return;
        }

        // redirect user to the calendar
        redirectToCalendar(this.project.calendar.id);

    }

    renameButtonOnClick() {

        const newName = window.prompt('What is the new name of the project?')!;
        if (newName.trim().length === 0) {
            window.alert(`Name "${newName}" is not a valid project name.`);
            return;
        }

        this.project.name = newName;
        this.project.commit();
        this.$gse('.gr-project-text').innerText = this.name;

    }

    editButtonOnClick() {
        this.addTabContextCallback(new EditProjectTab(this.project));
    }

    async trashButtonOnClick() {

        // confirm first
        const confirmResponse = window.confirm(`Are you sure you want to remove project "${this.name}"?`);
        if (!confirmResponse) {
            return;
        }

        // call project manager to remove this project
        await ProjectManager.destroyProject(this.project);
        await ProjectManager.commitChanges();

        // remove self
        this.deleteSelfCallback(this);

    }

    /**
     * Generates a search URL given a template URL and the search term
     * @param labelName {String}
     * @returns {Promise<String>}
     */
    async generateSearchURL(labelName: string) {
        var url = "https://mail.google.com/mail/u/0/?gr-redirect=no#label/"
        const address = await GmailAdapter.getEmailAddress();
        url = url.replace('0', address);
        const escapedSearchTerm = labelName.replace(/ /gi, '+');
        url = url + escapedSearchTerm;
        return url.replace('$1', escapedSearchTerm);
    }

    /**
     * Functionality for view button
     */
    async viewButtonOnClick() {
        const url = await this.generateSearchURL(this.name);
        console.log(url);
        window.open(url, '_blank', 'noopener');
    }

}

const contentHTMLTemplate = `
<div class="gr-side-line"></div>

<div class="gr-project-text">
    <p>Project</p>
</div>

<div style="display: inline-flex; column-gap: 10px; align-items: center;">
    <div style="display: flex; column-gap: 4px;">
        <img src="./assets/images/info.png" alt="details" class="gr-sicon gr-project-button">
        <img src="./assets/images/calendar.png" alt="view" class="gr-sicon gr-project-button">
        <img src="./assets/images/rename.png" alt="rename" class="gr-sicon gr-project-button">
        <img src="./assets/images/edit.png" alt="edit" class="gr-sicon gr-project-button">
        <img src="./assets/images/trash.png" alt="trash" class="gr-sicon gr-project-button">
    </div>

    <button class="gr-compose">
        <div class="gr-cross">+</div>
    </button>
</div>
`;