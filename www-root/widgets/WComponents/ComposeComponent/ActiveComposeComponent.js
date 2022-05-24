import {ComposeComponent} from "./ComposeComponent.js";

export class ActiveComposeComponent extends ComposeComponent {

    /*type{String}*/
    composeURL

    constructor(url) {
        super();
        this.composeURL = url;
        const button = this.element.querySelector(".gr-cross");
        button.innerText = '+';
        button.style.cursor = "pointer";
    }

    /**
     * Default behaviour of when the user clicks the 'plus' button
     */
    async onClick() {
        await this.openUserURL(this.composeURL);
    }

}