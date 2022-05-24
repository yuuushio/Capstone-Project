import {GAppWidget} from "../GAppWidget.js";
import {ComposeComponent} from "../WComponents/ComposeComponent/ComposeComponent.js";
import {SearchComponent} from "../WComponents/SearchComponent/SearchComponent.js";

export class GCloudSearchWidget extends GAppWidget {

    constructor() {
        super([
            new SearchComponent(),
            new ComposeComponent(),
        ]);
    }

    get name() {
        return "Cloud Search";
    }

    get targetURL() {
        return "https://cloud.google.com";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/nogit/gr_zip_brenda/cloud-search-icon.png";
    }

    get subtypeCSSClassName() {
        return "gr-cloud-search-widget";
    }

}