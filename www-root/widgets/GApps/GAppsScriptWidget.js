import {GAppWidget} from "../GAppWidget.js";
import {ComposeComponent} from "../WComponents/ComposeComponent/ComposeComponent.js";
import {AppsScriptSearchComponent} from "../WComponents/SearchComponent/AppsScriptSearchComponent.js";

const SEARCH_URL = 'https://script.google.com/home/?authuser=0&search?q=$1';

export class GAppsScriptWidget extends GAppWidget {

    constructor() {
        super([
            new AppsScriptSearchComponent(SEARCH_URL),
            new ComposeComponent()
        ]);
    }

    get name() {
        return "Apps Script";
    }

    get targetURL() {
        return "https://script.google.com/home/?authuser=0";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/nogit/gr_zip_brenda/apps-script-icon.png";
    }

    get subtypeCSSClassName() {
        return "gr-apps-script-widget";
    }

}