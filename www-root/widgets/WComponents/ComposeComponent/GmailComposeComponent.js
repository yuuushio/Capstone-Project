import {ActiveComposeComponent} from "./ActiveComposeComponent.js";
import {GmailAdapter} from "../../../Utilities/lib/ooGAPIAmalgamation.js";

export class GmailComposeComponent extends ActiveComposeComponent {

    constructor() {
        super();
    }

    async onClick() {
        await GmailAdapter.openComposeURL();
    }

}