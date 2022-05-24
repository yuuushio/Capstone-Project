import {GAppWidget} from "../GAppWidget.js";
import {ActiveComposeComponent} from "../WComponents/ComposeComponent/ActiveComposeComponent.js";
import {ActiveSearchComponent} from "../WComponents/SearchComponent/ActiveSearchComponent.js";

const EVENT_COMPOSE_URL = 'https://calendar.google.com/calendar/u/0/r/eventedit';
const SEARCH_URL = 'https://calendar.google.com/calendar/u/0/r/search?q=$1';

export class GCalendarWidget extends GAppWidget {

    constructor() {
        super([
            new ActiveSearchComponent(SEARCH_URL),
            new ActiveComposeComponent(EVENT_COMPOSE_URL)
        ]);
    }

    get name() {
        return "Calendar";
    }

    get targetURL() {
        return "https://calendar.google.com/calendar/u/0/r";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/icons/gcalendar.png";
    }

    get subtypeCSSClassName() {
        return "gr-calendar-widget";
    }

}