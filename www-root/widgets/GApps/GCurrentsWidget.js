import {GAppWidget} from "../GAppWidget.js";
import {ComposeComponent} from "../WComponents/ComposeComponent/ComposeComponent.js";
import {SearchComponent} from "../WComponents/SearchComponent/SearchComponent.js";

export class GCurrentsWidget extends GAppWidget {

    constructor() {
        super([
            new SearchComponent(),
            new ComposeComponent()
        ]);
    }

    get name() {
        return "Currents";
    }

    get targetURL() {
        return "https://currents.google.com";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/nogit/gr_zip_brenda/currents-icon.png";
    }

    get subtypeCSSClassName() {
        return "gr-currents-widget";
    }

}