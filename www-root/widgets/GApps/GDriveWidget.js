import {GAppWidget} from "../GAppWidget.js";
import {ComposeComponent} from "../WComponents/ComposeComponent/ComposeComponent.js";
import {ActiveSearchComponent} from "../WComponents/SearchComponent/ActiveSearchComponent.js";

const SEARCH_URL = 'https://drive.google.com/drive/u/0/search/$1'

export class GDriveWidget extends GAppWidget {

    constructor() {
        super([
            new ActiveSearchComponent(SEARCH_URL),
            new ComposeComponent()
        ]);
    }

    get name() {
        return "Drive";
    }

    get targetURL() {
        return "https://drive.google.com/drive/u/0/my-drive";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/nogit/gr_zip_brenda/drive-icon.png";
    }

    get subtypeCSSClassName() {
        return "gr-drive-widget";
    }

}