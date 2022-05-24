// TabContext Class
export class TabContext {
    /**
     * Create a new TabContext and set its name
     * @param name {string}
     */
    constructor(name) {
        this.contentElement = document.createElement('div');
        this.onButtonClick = () => { };
        this.onCloseButtonClick = () => { };
        /**
         * Title of the tab. Should be user friendly, and should be unique.
         * @type {string}
         */
        this.name = "";
        this.contentElement = document.createElement('div');
        /**
         * Title of the tab. Should be user friendly, and should be unique.
         * @type {string}
         */
        this.name = "";
        this.name = name;
        this.buttonElement = this.generateButton();
    }
    /**
     * Called when the context has been hidden from view
     */
    onHide() { }
    /**
     * Called when the context has become visible
     */
    onShow() { }
    /**
     * Get a sub-element of this.element from CSS selector. Throws if it's not found
     * @param selector - CSS selector
     * @private
     */
    $gse(selector) {
        const result = this.contentElement.querySelector(selector);
        if (!result) {
            throw new ReferenceError('Selector cannot be found');
        }
        return result;
    }
    /**
     * Generates the button for this tab
     * @returns {HTMLElement}
     */
    generateButton() {
        const newElement = document.createElement('div');
        newElement.classList.add("gr-tab-button");
        newElement.innerText = this.name;
        newElement.addEventListener('click', () => {
            this.onButtonClick();
        });
        return newElement;
    }
}
