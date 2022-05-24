// Tab Manager

export class TabManager {

    /** @type {TabContext[]} */
    tabs = []

    /** @type {TabContext} */
    activeTab
    /** @type {TabContext} */
    lastVisitedTab = null

    element = document.createElement('div');

    constructor() {
        this.element.innerHTML = contentHTMLTemplate;
        this.buttonBar = this.element.querySelector('.gr-tab-button-container');
        this.contentDiv = this.element.querySelector('.gr-tab-contents');
    }

    /**
     * Adds a tab content and generate new tab button
     * @param newTabContext {TabContext}
     */
    addTabContext(newTabContext) {
        this.tabs.push(newTabContext);
        this.hideTabContext(newTabContext);
        this.addButtonForTabContext(newTabContext);

        newTabContext.onButtonClick = () => {
            this.setActiveTab(newTabContext);
        };
        newTabContext.onCloseButtonClick = () => {
            this.removeTabContext(newTabContext);
        };

        this.contentDiv.appendChild(newTabContext.contentElement);
    }

    /**
     * Removes a tab content and generate new tab button
     * @param tabContext {TabContext}
     */
    removeTabContext(tabContext) {

        // remove elements from document
        this.buttonBar.removeChild(tabContext.buttonElement);
        this.contentDiv.removeChild(tabContext.contentElement);

        // remove button and tab
        this.tabs = this.tabs.filter(function(ele){ return ele !== tabContext; });

        // if active tab is being closed, revert to the last visited tab
        if (this.activeTab === tabContext) {
            this.setActiveTab(this.lastVisitedTab);
        }

    }

    addButtonForTabContext(context) {
        const button = context.buttonElement;
        this.buttonBar.appendChild(button);
    }

    _setButtonActive(buttonElement) {
        buttonElement.classList.add('gr-active');
    }

    _deactivateActiveButton() {
        const currentActiveButton = this.buttonBar.querySelector('.gr-tab-button.gr-active');
        if (currentActiveButton) {
            currentActiveButton.classList.remove('gr-active');
        }
    }

    /**
     * Make tab content elements visible
     * @param context {TabContext}
     */
    showTabContext(context) {
        context.contentElement.style.display = null;
        context.onShow();
    }

    /**
     * Make tab content elements invisible
     * @param context {TabContext}
     */
    hideTabContext(context) {
        context.contentElement.style.display = 'none';
        context.onHide();
    }

    /**
     * Set a particular tab content to be active
     * @param newActiveTab {TabContext}
     */
    setActiveTab(newActiveTab) {

        if (newActiveTab === this.activeTab) {
            return;
        }

        this._deactivateActiveButton();
        this._setButtonActive(newActiveTab.buttonElement);

        const oldActiveTab = this.activeTab;
        if (oldActiveTab) {
            this.hideTabContext(oldActiveTab);
        }
        this.showTabContext(newActiveTab);

        // change activeTab
        this.lastVisitedTab = this.activeTab;
        this.activeTab = newActiveTab;

    }

}

const contentHTMLTemplate = `

<div class="gr-tab-button-container-outer">
<div class="gr-tab-button-container">

</div>
</div>

<div class="gr-tab-contents">


</div>

`;