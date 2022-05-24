// Main Class

import {ProjectTab} from "./Tabbing/Projects/ProjectTab.js";
import {ConfigStorage} from "./Utilities/ConfigStorage.js";
import {ElementRoot} from "./ElementRoot.js";
import {DefaultTab} from "./Tabbing/DefaultTab.js";
import {GameContext} from "./Tabbing/GameContext.js";
import {GAppsScriptWidget} from "./widgets/GApps/GAppsScriptWidget.js";
import {GCalendarWidget} from "./widgets/GApps/GCalendarWidget.js";
import {GChatWidget} from "./widgets/GApps/GChatWidget.js";
import {GCloudSearchWidget} from "./widgets/GApps/GCloudSearchWidget.js";
import {GCurrentsWidget} from "./widgets/GApps/GCurrentsWidget.js";
import {GDocsWidget} from "./widgets/GApps/GDocsWidget.js";
import {GDriveWidget} from "./widgets/GApps/GDriveWidget.js";
import {GFormsWidget} from "./widgets/GApps/GFormsWidget.js";
import {GKeepWidget} from "./widgets/GApps/GKeepWidget.js";
import {GMailWidget} from "./widgets/GApps/GMailWidget.js";
import {GMeetWidget} from "./widgets/GApps/GMeetWidget.js";
import {GSheetsWidget} from "./widgets/GApps/GSheetsWidget.js";
import {GSitesWidget} from "./widgets/GApps/GSitesWidget.js";
import {GSlidesWidget} from "./widgets/GApps/GSlidesWidget.js";
import {PositionManager} from "./widgets/Positions/PositionManager.js";


export class App {

    static async main() {

        App.addGlobalVariables();

        // Create a global elementRoot and its tab manager
        const elementRoot = new ElementRoot();
        document.body.insertAdjacentElement('beforeend', elementRoot.element);

        // create two tabs
        const tab1 = new DefaultTab("Home");
        const tab2 = new GameContext("Game");
        const tab3 = new ProjectTab("Projects", elementRoot.tabManager);

        elementRoot.tabManager.addTabContext(tab1);
        elementRoot.tabManager.addTabContext(tab2);
        elementRoot.tabManager.addTabContext(tab3);
        elementRoot.tabManager.setActiveTab(tab1);

        // Make sure PositionManager is ready
        await PositionManager.initialise();

        // add the defaultWidgets, and show the elementRoot
        this._createDefaultWidgets().forEach(w => tab1.addWidget(w));

    }

    static addGlobalVariables() {
        window.GSuiteRedux = {};
        try {
            window.GSuiteRedux.staticURLBase = chrome.runtime.getURL('static');
        } catch (e) {
            window.GSuiteRedux.staticURLBase = location.href;
        }
        window.GSuiteRedux.ConfigStorage = ConfigStorage;
    }

    static _createDefaultWidgets() {
        return [
            new GMailWidget(),
            new GDocsWidget(),
            new GSheetsWidget(),
            new GCalendarWidget(),
            new GSlidesWidget(),
            new GMeetWidget(),
            new GChatWidget(),
            new GDriveWidget(),
            new GFormsWidget(),
            new GAppsScriptWidget(),
            new GSitesWidget(),
            new GCloudSearchWidget(),
            new GKeepWidget(),
            new GCurrentsWidget()
        ];
    }

}
