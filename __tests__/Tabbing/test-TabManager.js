/** @type {TabManager} */
import {TabManager} from "../../www-root/Tabbing/TabManager.js";
import {TabContext} from "../../www-root/Tabbing/TabContext.js";
import {ClosableTab} from "../../www-root/Tabbing/ClosableTab.js";

/** @type {TabManager} */
let testSubject;
let tab1 = new TabContext('Something');
let tab2 = new TabContext('Something else');
let closableTab1 = new ClosableTab('Closable 1');
let closableTab2 = new ClosableTab('Closable 2');

describe('Test TabManager', () => {

    beforeEach(() => {
        testSubject = new TabManager();
    })

    it('should initialise', () => {
        expect(testSubject).toBeTruthy();
        expect(testSubject).toBeInstanceOf(TabManager);
    })

    it('should add tabs', () => {
        testSubject.addTabContext(tab1);
        expect(testSubject.tabs).toHaveLength(1);
        expect(testSubject.tabs[0]).toBe(tab1);
        testSubject.addTabContext(tab2);
        expect(testSubject.tabs).toHaveLength(2);
        expect(testSubject.tabs[0]).toBe(tab1);
        expect(testSubject.tabs[1]).toBe(tab2);
    })

    it('should add tab contents', () => {
        testSubject.addTabContext(tab1);
        expect(testSubject.contentDiv.children).toHaveLength(1);
        expect(testSubject.contentDiv.children[0]).toBe(tab1.contentElement);
        testSubject.addTabContext(tab2);
        expect(testSubject.contentDiv.children).toHaveLength(2);
        expect(testSubject.contentDiv.children[0]).toBe(tab1.contentElement);
        expect(testSubject.contentDiv.children[1]).toBe(tab2.contentElement);
    })

    it('should add hidden tab contents', () => {
        testSubject.addTabContext(tab1);
        expect(testSubject.contentDiv.children[0].style.display).toBe('none');
        testSubject.addTabContext(tab2);
        expect(testSubject.contentDiv.children[0].style.display).toBe('none');
        expect(testSubject.contentDiv.children[1].style.display).toBe('none');
    })

    it('should add buttons for tabs', () => {
        testSubject.addTabContext(tab1);
        expect(testSubject.buttonBar.children).toHaveLength(1);
        expect(testSubject.buttonBar.children[0]).toBe(tab1.buttonElement);
        testSubject.addTabContext(tab2);
        expect(testSubject.buttonBar.children).toHaveLength(2);
        expect(testSubject.buttonBar.children[0]).toBe(tab1.buttonElement);
        expect(testSubject.buttonBar.children[1]).toBe(tab2.buttonElement);
    })

    it('should set active tab', () => {
        testSubject.addTabContext(tab1);
        testSubject.addTabContext(tab2);
        testSubject.setActiveTab(tab1);
        expect(testSubject.activeTab).toBe(tab1);
        expect(tab1.buttonElement.classList.contains('gr-active'));
        expect(tab1.contentElement.style.display).toBe("");
        testSubject.setActiveTab(tab2);
        expect(testSubject.activeTab).toBe(tab2);
        expect(tab2.buttonElement.classList.contains('gr-active'));
        expect(tab2.contentElement.style.display).toBe("");
    })

    it('should deactivate the previously active tab when setting a new active tab', () => {
        testSubject.addTabContext(tab1);
        testSubject.addTabContext(tab2);
        testSubject.setActiveTab(tab1);
        expect(testSubject.activeTab).toBe(tab1);
        expect(tab1.buttonElement.classList.contains('gr-active'));
        expect(tab1.contentElement.style.display).toBe("");
        testSubject.setActiveTab(tab2);
        expect(!tab1.buttonElement.classList.contains('gr-active'));
        expect(tab1.contentElement.style.display).toBe("none");
        expect(testSubject.activeTab).toBe(tab2);
        expect(tab2.buttonElement.classList.contains('gr-active'));
        expect(tab2.contentElement.style.display).toBe("");
    })

    it('should add closable tabs', () => {
        testSubject.addTabContext(tab1);
        expect(testSubject.tabs).toHaveLength(1);
        expect(testSubject.tabs[0]).toBe(tab1);
        testSubject.addTabContext(tab2);
        expect(testSubject.tabs).toHaveLength(2);
        expect(testSubject.tabs[0]).toBe(tab1);
        expect(testSubject.tabs[1]).toBe(tab2);
        testSubject.addTabContext(closableTab1);
        expect(testSubject.tabs).toHaveLength(3);
        expect(testSubject.tabs[0]).toBe(tab1);
        expect(testSubject.tabs[1]).toBe(tab2);
        expect(testSubject.tabs[2]).toBe(closableTab1);
        testSubject.addTabContext(closableTab2);
        expect(testSubject.tabs).toHaveLength(4);
        expect(testSubject.tabs[0]).toBe(tab1);
        expect(testSubject.tabs[1]).toBe(tab2);
        expect(testSubject.tabs[2]).toBe(closableTab1);
        expect(testSubject.tabs[3]).toBe(closableTab2);
    })

    it('should add the contents of closable tabs', () => {
        testSubject.addTabContext(closableTab1);
        expect(testSubject.contentDiv.children).toHaveLength(1);
        expect(testSubject.contentDiv.children[0]).toBe(closableTab1.contentElement);
        testSubject.addTabContext(closableTab2);
        expect(testSubject.contentDiv.children).toHaveLength(2);
        expect(testSubject.contentDiv.children[0]).toBe(closableTab1.contentElement);
        expect(testSubject.contentDiv.children[1]).toBe(closableTab2.contentElement);
    })

    it('should add hidden tab contents for closable tabs', () => {
        testSubject.addTabContext(closableTab1);
        expect(testSubject.contentDiv.children[0].style.display).toBe('none');
        testSubject.addTabContext(closableTab2);
        expect(testSubject.contentDiv.children[0].style.display).toBe('none');
        expect(testSubject.contentDiv.children[1].style.display).toBe('none');
    })

    it('should add buttons for closable tabs', () => {
        testSubject.addTabContext(closableTab1);
        expect(testSubject.buttonBar.children).toHaveLength(1);
        expect(testSubject.buttonBar.children[0]).toBe(closableTab1.buttonElement);
        testSubject.addTabContext(closableTab2);
        expect(testSubject.buttonBar.children).toHaveLength(2);
        expect(testSubject.buttonBar.children[0]).toBe(closableTab1.buttonElement);
        expect(testSubject.buttonBar.children[1]).toBe(closableTab2.buttonElement);
    })

    it('should remove closable tabs', () => {
        testSubject.addTabContext(tab1);
        testSubject.addTabContext(tab2);
        testSubject.addTabContext(closableTab1);
        testSubject.addTabContext(closableTab2);
        expect(testSubject.tabs).toHaveLength(4);
        testSubject.removeTabContext(closableTab1);
        expect(testSubject.tabs).toHaveLength(3);
        expect(testSubject.tabs[0]).toBe(tab1);
        expect(testSubject.tabs[1]).toBe(tab2);
        expect(testSubject.tabs[2]).toBe(closableTab2);
    })

    it("should remove closable tabs' contents", () => {
        testSubject.addTabContext(tab1);
        testSubject.addTabContext(tab2);
        testSubject.addTabContext(closableTab1);
        testSubject.addTabContext(closableTab2);
        expect(testSubject.contentDiv.children).toHaveLength(4);
        testSubject.removeTabContext(closableTab1);
        expect(testSubject.contentDiv.children).toHaveLength(3);
        expect(testSubject.contentDiv.children[0]).toBe(tab1.contentElement);
        expect(testSubject.contentDiv.children[1]).toBe(tab2.contentElement);
        expect(testSubject.contentDiv.children[2]).toBe(closableTab2.contentElement);
    })

    it("should remove closable tabs' buttons", () => {
        testSubject.addTabContext(tab1);
        testSubject.addTabContext(tab2);
        testSubject.addTabContext(closableTab1);
        testSubject.addTabContext(closableTab2);
        expect(testSubject.buttonBar.children).toHaveLength(4);
        testSubject.removeTabContext(closableTab1);
        expect(testSubject.buttonBar.children).toHaveLength(3);
        expect(testSubject.buttonBar.children[0]).toBe(tab1.buttonElement);
        expect(testSubject.buttonBar.children[1]).toBe(tab2.buttonElement);
        expect(testSubject.buttonBar.children[2]).toBe(closableTab2.buttonElement);
    })

    it('should keep the home tab active once a tab is closed', () => {
        testSubject.addTabContext(tab1);
        testSubject.addTabContext(tab2);
        testSubject.addTabContext(closableTab1);
        testSubject.addTabContext(closableTab2);
        testSubject.setActiveTab(tab1);
        expect(testSubject.activeTab).toBe(tab1);
        expect(tab1.buttonElement.classList.contains("gr-active"));
        expect(tab1.contentElement.style.display).toBe("");
        testSubject.removeTabContext(closableTab1);
        expect(testSubject.activeTab).toBe(tab1);
        expect(tab1.buttonElement.classList.contains("gr-active"));
        expect(tab1.contentElement.style.display).toBe("");
    })

    it('should keep the same tab active once a tab is closed', () => {
        testSubject.addTabContext(tab1);
        testSubject.addTabContext(tab2);
        testSubject.addTabContext(closableTab1);
        testSubject.addTabContext(closableTab2);
        testSubject.setActiveTab(tab2);
        expect(testSubject.activeTab).toBe(tab2);
        expect(tab2.buttonElement.classList.contains("gr-active"));
        expect(tab2.contentElement.style.display).toBe("");
        testSubject.removeTabContext(closableTab1);
        expect(testSubject.activeTab).toBe(tab2);
        expect(tab2.buttonElement.classList.contains("gr-active"));
        expect(tab2.contentElement.style.display).toBe("");
    });

    it('should record active and last active tabs', () => {

        testSubject.addTabContext(tab1);
        testSubject.addTabContext(tab2);

        testSubject.setActiveTab(tab1);
        expect(testSubject.activeTab).toBe(tab1);

        testSubject.setActiveTab(tab2);
        expect(testSubject.activeTab).toBe(tab2);
        expect(testSubject.lastVisitedTab).toBe(tab1);

        testSubject.setActiveTab(tab1);
        expect(testSubject.activeTab).toBe(tab1);
        expect(testSubject.lastVisitedTab).toBe(tab2);

    });

    it('should not change lastVisitedTab on successive calls to set the same tab', () => {

        testSubject.addTabContext(tab1);
        testSubject.addTabContext(tab2);

        testSubject.setActiveTab(tab1);
        testSubject.setActiveTab(tab2);
        testSubject.setActiveTab(tab1);
        expect(testSubject.activeTab).toBe(tab1);
        expect(testSubject.lastVisitedTab).toBe(tab2);

        testSubject.setActiveTab(tab1);
        expect(testSubject.lastVisitedTab).toBe(tab2);

    });

})