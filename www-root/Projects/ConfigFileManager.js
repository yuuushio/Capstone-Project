// Management class for handling importing and exporting files
import { ProjectManager } from "./ProjectManager.js";
const LOCALSTORAGE_KEY = "gr-project-manager-serialised-list";
export class ConfigFileManager {
    /**
     * Import a file, overwriting existing settings
     * @param file - JS object File, as provided by an <input type="file">
     */
    static async importFile(file) {
        const fileText = await file.text();
        localStorage.setItem(LOCALSTORAGE_KEY, fileText);
        await ProjectManager.refresh();
    }
    /**
     * Exports the current config into a JSON string
     * @returns a valid JSON string
     */
    static async exportToJSONString() {
        await ProjectManager.commitChanges();
        const result = localStorage.getItem(LOCALSTORAGE_KEY);
        if (!result) {
            throw new TypeError("You should never see me");
        }
        return result;
    }
    /**
     * Exports the current config, and download it into the browser
     */
    static async exportToFileDownload() {
        downloadString(await this.exportToJSONString(), "gsuite-redux-projects.json");
    }
}
/**
 * Trick the browser into downloading a string
 * @param content - the string to download
 * @param fileName - filename to pretend to have
 */
function downloadString(content, fileName) {
    const fakeAnchor = document.createElement('a');
    fakeAnchor.href = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
    fakeAnchor.download = fileName;
    fakeAnchor.style.display = 'none';
    document.body.appendChild(fakeAnchor);
    fakeAnchor.click();
    document.body.removeChild(fakeAnchor);
}
