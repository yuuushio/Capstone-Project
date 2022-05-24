import {WComponent} from "../WComponent.js";

export class SearchComponent extends WComponent {

    constructor() {
        super();
        this.element.innerHTML = buttonHTMLTemplate;
        this.element.addEventListener('click', this.onClick.bind(this));
        this.element.querySelector('.gr-search').style.cursor = "auto";
    }

    /**
     * Called when the "search" button is clicked.
     */
    onClick() {
        // do nothing
    }

}

const buttonHTMLTemplate = `
<button class="gr-search">
</button>
`;