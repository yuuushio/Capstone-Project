import { TabContext } from "./TabContext.js";
export class ClosableTab extends TabContext {
    constructor(name) {
        super(name);
    }
    /**
     * Generates the button for this tab
     * @returns {HTMLElement}
     */
    // TODO cleanup duplicate logic that's already present in the superclass
    generateButton() {
        const newElement = document.createElement('div');
        newElement.classList.add("gr-tab-button");
        newElement.innerText = this.name;
        // insert a close button
        newElement.insertAdjacentHTML("beforeend", '<span class="gr-tab-button-close-filler"></span>');
        /*const closeElement = newElement.querySelector(".gr-tab-button-close")!;
        closeElement.addEventListener('click', (event) => {
            event.stopPropagation();
            this.onCloseButtonClick();
        });*/
        newElement.addEventListener('click', () => {
            this.onButtonClick();
        });
        return newElement;
    }
}
