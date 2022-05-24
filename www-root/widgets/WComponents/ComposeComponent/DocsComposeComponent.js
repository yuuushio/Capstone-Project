import {ActiveComposeComponent} from "./ActiveComposeComponent.js";

export class DocsComposeComponent extends ActiveComposeComponent {

    /*type{GDocsAdapter}*/
    gDocsAdapter

    constructor(gDocsAdapter){
        super();
        this.gDocsAdapter = gDocsAdapter;
    }

    async onClick() {
        await this.gDocsAdapter.openNewDoc();
    }

}