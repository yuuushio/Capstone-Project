// Tab Manager Module File
// for gsuite-redux companion WebExtension
import { SnoozeService } from "./SnoozeService.js";
import { REDIRECT_TARGET } from "../config.js";
let frozenTabIdSet = new Set();
export class TabManager {
    /**
     * Listener for tab update. Should be called if and only if URL is changed
     * @param tabId - the tab ID supplied by browser
     * @param newURL - the new URL as a string
     * See https://developer.chrome.com/extensions/tabs#event-onUpdated for an explanation on how to adapt this.
     */
    static tabUpdateListener(tabId, newURL) {
        // don't do anything if is snoozed
        if (SnoozeService.isCurrentlySnoozing()) {
            return;
        }
        // first, skip all frozen tabs
        if (frozenTabIdSet.has(tabId)) {
            return;
        }
        // check URL itself
        if (this.isGmailURL(newURL)) {
            if (this.urlHasOptOutFlag(newURL)) {
                frozenTabIdSet.add(tabId);
            }
            else {
                this.redirectTab(tabId);
            }
        }
    }
    /**
     * Listener for tab close
     * @param tabId - the tab ID supplied by browser
     */
    static tabCloseListener(tabId) {
        frozenTabIdSet.delete(tabId);
    }
    /**
     * Check if a URL is a gmail one
     * @param url - the URL to be checked
     */
    static isGmailURL(url) {
        return url.includes("https://mail.google.com");
    }
    /**
     * Check if a URL has a "no redirect" freeze flag
     * @param url - the URL to be checked
     */
    static urlHasOptOutFlag(url) {
        return url.includes('gr-redirect=no');
    }
    /**
     * Redirect a tab to our website
     * @param tabId - id of tab to redirect
     */
    static redirectTab(tabId) {
        // @ts-ignore
        chrome.tabs.update(tabId, {
            url: REDIRECT_TARGET
        });
    }
}
