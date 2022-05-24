import {WComponent} from "../WComponent.js";

export class ComposeComponent extends WComponent {

    constructor() {
        super();
        this.element.innerHTML = buttonHTMLTemplate;
        const button = this.element.querySelector('.gr-compose');
        button.style.cursor = "auto";
        button.addEventListener('click', this.onClick.bind(this));
    }

    /**
     * Called when the "plus" button is clicked.
     */
    onClick() {
        // do nothing
    }

}

const buttonHTMLTemplate = `
    <button class="gr-compose">
        <div class="gr-cross"></div>
    </button>
    <div class="dropdown-content">
    </div>
`;