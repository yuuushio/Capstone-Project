import {DocsAdapter} from "../../Utilities/lib/ooGAPIAmalgamation.js";
import {GAppWidget} from "../GAppWidget.js";
import {DocsComposeComponent} from "../WComponents/ComposeComponent/DocsComposeComponent.js";
import {ActiveSearchComponent} from "../WComponents/SearchComponent/ActiveSearchComponent.js";

const SEARCH_URL = 'https://docs.google.com/document/?authuser=0&q=$1';

export class GDocsWidget extends GAppWidget {

    constructor() {
        super([
            new ActiveSearchComponent(SEARCH_URL),
            new DocsComposeComponent(DocsAdapter)
        ]);
    }

    get name() {
        return "Docs";
    }

    get targetURL() {
        return "https://docs.google.com/document/?authuser=0";
        //return "https://drive.google.com/drive/u/0/search?q=type:document";
        //return "https://docs.google.com";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/icons/gdocs.png";
    }

    get subtypeCSSClassName() {
        return "gr-docs-widget";
    }

    onPlusClick() {
        DocsAdapter.openNewDoc();
    }

}