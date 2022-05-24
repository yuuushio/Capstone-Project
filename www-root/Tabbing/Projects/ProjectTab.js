import { WidgetBasedTabContext } from "../WidgetBasedTabContext.js";
import { ProjectManager } from "../../Projects/ProjectManager.js";
import { ConfigFileManager } from "../../Projects/ConfigFileManager.js";
import { ProjectWidget } from "../../widgets/ProjectWidget.js";
import { CreateProjectTab } from "./CreateProjectTab.js";
// @ts-ignore
import { GoogleAuthCallbacks, GoogleAuthManager } from "../../Utilities/lib/ooGAPIAmalgamation.js";
export class ProjectTab extends WidgetBasedTabContext {
    constructor(name, tabManager) {
        super(name);
        this.projectWidgets = [];
        // content element setup
        this.contentElement.classList.add('gr-project-tab');
        this.constructContentElement();
        this.addComposeMetaWidget();
        this.loadAllProjects();
        this.tabManager = tabManager;
        // listen for events in log in and log out
        GoogleAuthCallbacks.listenToLogOut(this.refresh.bind(this));
        GoogleAuthCallbacks.listenToLogIn(this.refresh.bind(this));
    }
    // TODO - refactor this into its own class?
    addComposeMetaWidget() {
        let widgetElement = document.createElement('div');
        widgetElement.classList.add('project-compose-widget');
        widgetElement.innerHTML = addProjectWidget;
        widgetElement.addEventListener('click', this.createNewButtonOnClick.bind(this));
        this.contentElement.insertAdjacentElement('beforeend', widgetElement);
    }
    constructContentElement() {
        this.contentElement.classList.add('project-container');
        this.contentElement.insertAdjacentHTML('beforeend', contentHTMLAppendix);
        this.$gse('#gr-project-import').addEventListener('click', this.importButtonOnClick.bind(this));
        this.$gse('#gr-project-export').addEventListener('click', this.exportButtonOnClick.bind(this));
    }
    /**
     * Handle click for the create new project button
     */
    createNewButtonOnClick() {
        // do nothing if not signed in
        if (!GoogleAuthManager.signedIn) {
            return;
        }
        const newTab = new CreateProjectTab();
        this.tabManager.addTabContext(newTab);
        this.tabManager.setActiveTab(newTab);
    }
    /**
     * Click handler for the import button
     */
    importButtonOnClick() {
        // INOP for now
    }
    /**
     * Click handler for the export button
     */
    exportButtonOnClick() {
        ConfigFileManager.exportToFileDownload();
    }
    /**
     * Handle cases where the user isn't logged in
     */
    notifyNotLoggedIn() {
        this.$gse('.gr-project-compose-text').innerText = "PLEASE LOG IN WITH GOOGLE";
        this.$gse('.project-compose-button').classList.add('invalid');
    }
    /**
     * Undo notifyNotLoggedIn()
     */
    notifyLoggedIn() {
        this.$gse('.gr-project-compose-text').innerText = 'New Project';
        this.$gse('.project-compose-button').classList.remove('invalid');
    }
    /**
     * Adds all project widgets
     */
    loadAllProjects() {
        // bail out if not logged in
        try {
            if (!GoogleAuthManager.signedIn) {
                this.notifyNotLoggedIn();
                return;
            }
            else {
                this.notifyLoggedIn();
            }
        }
        catch (e) {
            // probably just not initialised yet
            return;
        }
        // construct the callback needed by ProjectWidget class
        const addNewTabCallback = (context) => {
            this.tabManager.addTabContext(context);
            this.tabManager.setActiveTab(context);
        };
        const deleteSelfCallback = (widget) => {
            this.removeWidget(widget);
        };
        // add all widgets
        const allProjects = ProjectManager.getAllProjects();
        for (const project of allProjects) {
            const newWidget = new ProjectWidget(project, addNewTabCallback, deleteSelfCallback);
            this.projectWidgets.push(newWidget);
            this.addWidget(newWidget);
        }
    }
    removeAllProjectWidgets() {
        this.projectWidgets.forEach(widget => {
            this.removeWidget(widget);
        });
        this.projectWidgets = [];
    }
    /**
     * Refreshes the project widgets from ProjectManager
     */
    refresh() {
        this.removeAllProjectWidgets();
        this.loadAllProjects();
    }
    async onShow() {
        super.onShow();
        await ProjectManager.refresh();
        this.refresh();
    }
}
const contentHTMLAppendix = `
<button id="gr-project-import" class="btn btn-outline-info" style="display: none">Import</button>
<button id="gr-project-export" class="btn btn-outline-success" style="display: none">Export</button>
`;
const addProjectWidget = `
<button class="project-compose-button">
</button>
<div class="gr-project-compose-text">New Project</div>
`;
