// Project Manager Class
import { Project } from "./Project.js";
// @ts-ignore
import { CalendarAdapter, GDriveAdapter, GmailAdapter } from "../Utilities/lib/ooGAPIAmalgamation.js";
const LOCALSTORAGE_KEY = "gr-project-manager-serialised-list";
const GDRIVE_FILE_NAME = 'config.json';
class ProjectManagerImpl {
    constructor() {
        this.initialised = false;
        this.projects = [];
    }
    initialise() {
        if (this.initialised) {
            console.warn('Calling initialise project manager again?');
            return;
        }
        this.refresh();
        this.initialised = true;
    }
    /**
     * Re-load the serialised array from local storage.
     * Fires up a request to update localStorage to Google Drive App storage as well.
     */
    async refresh() {
        const serialisedArray = ProjectManagerImpl._getSerialisedListFromLocalStorage();
        this.projects = [];
        // make all projects
        for (const serialisedProject of serialisedArray) {
            let newProject = Project.generateFromSerialised(serialisedProject);
            this.registerHookFor(newProject);
            this.projects.push(newProject);
        }
        try {
            await this.downloadProjectsFromGDrive();
        }
        catch (e) {
            // ignored
        }
    }
    /**
     * Backs up a copy of all serialised projects to Google Drive app storage
     */
    async backupProjectsToGDrive() {
        const serialisedArray = localStorage.getItem(LOCALSTORAGE_KEY);
        const array = JSON.parse(serialisedArray);
        await writeDriveFileContent(array);
    }
    /**
     * Download a list of serialised projects, and update this.projects & the localStorage backup
     */
    async downloadProjectsFromGDrive() {
        const newSerialisedObject = await getDriveFileContent();
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(newSerialisedObject));
    }
    /**
     * Pull all projects from local storage
     */
    static _getSerialisedListFromLocalStorage() {
        // try getting it from local storage
        const rawString = localStorage.getItem(LOCALSTORAGE_KEY);
        // bail out if it doesn't exist
        if (!rawString) {
            return [];
        }
        // try parsing it as an array
        let parseResult = JSON.parse(rawString);
        if (!(parseResult instanceof Array)) {
            throw new Error(`Whatever's inside localStorage doesn't seem to be valid`);
        }
        return parseResult;
    }
    /**
     * Gets a copy of all the projects known to the manager
     */
    getAllProjects() {
        return [...this.projects];
    }
    /**
     * Adds a project to this manager
     * @param newProject the project to add
     */
    addProject(newProject) {
        // bail out if the project already exists
        if (this.hasProjectId(newProject.id)) {
            return;
        }
        this.projects.push(newProject);
        this.registerHookFor(newProject);
    }
    /**
     * Gets the registered project by its id
     * Throws an exception if it doesn't exist
     * @param targetId - project.id
     */
    getProjectById(targetId) {
        for (const project of this.projects) {
            if (project.id === targetId) {
                return project;
            }
        }
        throw new ReferenceError(`ProjectManager does not have a project with id ${targetId}`);
    }
    /**
     * Deletes a project.
     * This will delete the project's ID, regardless of whether the reference is the same.
     * It's a NOOP if the project doesn't already exist.
     * @param project - project to delete
     */
    removeProject(project) {
        // sanity check first
        if (!this.hasProjectId(project.id)) {
            throw new ReferenceError(`ProjectManager does not have a project with id ${project.id}`);
        }
        const idToExclude = project.id;
        this.projects = this.projects.filter(item => item.id !== idToExclude);
    }
    _findIndexOfProjectId(id) {
        for (let i = 0; i < this.projects.length; ++i) {
            const thisProject = this.projects[i];
            if (thisProject.id === id) {
                // found it
                return i;
            }
        }
        throw new ReferenceError('project not found');
    }
    /**
     * Replace the registered project that has the same id with the provided project.
     * If the project doesn't exist, this will add it.
     * @param project - new project to replace
     */
    updateProject(project) {
        try {
            const index = this._findIndexOfProjectId(project.id);
            this.projects[index] = project;
        }
        catch (e) {
            if (e.message === 'project not found') {
                this.addProject(project);
            }
        }
    }
    /**
     * Creates a project afresh, and register the project at the same time.
     * This will also create a new label and calendar (if providing) in the user's Gmail account
     * @param name - name of the project
     * @param colour - colour in css format
     * @param createCalendar -
     */
    async createProject(name, colour, createCalendar = false) {
        const label = await ProjectManagerImpl.createLabel(name);
        const calendar = createCalendar ? await ProjectManagerImpl.createCalendar(name) : null;
        const newProject = new Project(name, colour, label, calendar);
        this.addProject(newProject);
        return newProject;
    }
    /**
     * Create a new calendar
     * @param name - the name to create for
     * @private
     */
    static async createCalendar(name) {
        return await CalendarAdapter.createCalendar(name);
    }
    /**
     * Create a new label
     * @param name - the name to create for
     * @private
     */
    static async createLabel(name) {
        return await GmailAdapter.createNewLabel(name);
    }
    /**
     * Returns whether this project is already registered with the manager
     * @param id UUID of the project
     */
    hasProjectId(id) {
        return this.projects.some(item => item.id === id);
    }
    /**
     * Register the project to notify this of any changes.
     * NOTE - if this is called multiple times on the same object, it should be a noop.
     * @param project - target to register hooks for
     */
    registerHookFor(project) {
        const callback = async (project) => {
            this.updateProject(project);
            await this.commitChanges();
        };
        project.registerModificationCallback(callback);
    }
    /**
     * Commit all changes to local storage
     */
    async commitChanges() {
        const allSerialised = this.projects.map(proj => proj.serialise());
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(allSerialised));
        await this.backupProjectsToGDrive();
    }
    /**
     * Destroys a project. Will remove it and delete its associated label and calendar.
     * @param project
     */
    async destroyProject(project) {
        const promises = [];
        // remove label
        const label = project.label;
        promises.push(GmailAdapter.removeLabel(label));
        // remove calendar
        if (project.calendar) {
            promises.push(CalendarAdapter.removeCalendar(project.calendar));
        }
        // wait till it's over, then remove self
        await Promise.all(promises);
        project.selfDestruct();
        this.removeProject(project);
    }
}
async function getDriveFileContent() {
    const file_ids = await GDriveAdapter.getAppDataFileIDsByName(GDRIVE_FILE_NAME);
    if (file_ids.length === 0) {
        await GDriveAdapter.createAppDataFile(GDRIVE_FILE_NAME);
        return null;
    }
    return await GDriveAdapter.getAppDataFileContent(file_ids[0]);
}
async function writeDriveFileContent(newContent) {
    let file_ids = await GDriveAdapter.getAppDataFileIDsByName(GDRIVE_FILE_NAME);
    if (file_ids.length === 0) {
        file_ids[0] = GDriveAdapter.createAppDataFile(GDRIVE_FILE_NAME);
    }
    return await GDriveAdapter.saveAppData(file_ids[0], newContent);
}
const projectManagerSingleton = new ProjectManagerImpl();
projectManagerSingleton.initialise();
export { projectManagerSingleton as ProjectManager };
