import {GAppWidget} from "../GAppWidget.js";
import {KeepSearchComponent} from "../WComponents/SearchComponent/KeepSearchComponent.js";
import {ActiveComposeComponent} from "../WComponents/ComposeComponent/ActiveComposeComponent.js";

const HOME_URL = 'https://keep.google.com/u/0/#home';
const SEARCH_URL = 'https://keep.google.com/u/0/#search/text%253D$1';

export class GKeepWidget extends GAppWidget {

    constructor() {
        super([
            new KeepSearchComponent(SEARCH_URL),
            new ActiveComposeComponent(HOME_URL)
        ]);
    }

    get name() {
        return "Keep";
    }

    get targetURL() {
        return HOME_URL;
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/nogit/gr_zip_brenda/keep-icon.png";
    }

    get subtypeCSSClassName() {
        return "gr-keep-widget";
    }

}