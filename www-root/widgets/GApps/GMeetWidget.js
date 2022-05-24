import {GAppWidget} from "../GAppWidget.js";
import {ActiveComposeComponent} from "../WComponents/ComposeComponent/ActiveComposeComponent.js";
import {SearchComponent} from "../WComponents/SearchComponent/SearchComponent.js";

const MEET_COMPOSE_URL = 'https://calendar.google.com/calendar/u/0/r/eventedit?vcon=meet&dates=now&hl=en';
const TARGET_URL = "https://meet.google.com/?authuser=0";

export class GMeetWidget extends GAppWidget {

    constructor() {
        super([
            new SearchComponent(),
            new ActiveComposeComponent(MEET_COMPOSE_URL)
        ]);
    }

    get name() {
        return "Meet";
    }

    get targetURL() {
        return TARGET_URL;
        //return "https://meet.google.com";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/nogit/gr_zip_brenda/meet-icon.png";
    }

    get subtypeCSSClassName() {
        return "gr-meet-widget";
    }

}