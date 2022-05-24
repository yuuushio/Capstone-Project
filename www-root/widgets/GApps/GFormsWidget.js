import {GAppWidget} from "../GAppWidget.js";
import {ComposeComponent} from "../WComponents/ComposeComponent/ComposeComponent.js";
import {ActiveSearchComponent} from "../WComponents/SearchComponent/ActiveSearchComponent.js";

const FORMS_COMPOSE_URL = 'https://docs.google.com/forms/create/?authuser=0';
const SEARCH_URL = 'https://docs.google.com/forms/?authuser=0&q=$1';

export class GFormsWidget extends GAppWidget {

    constructor() {
        super([
            new ActiveSearchComponent(SEARCH_URL),
            new ComposeComponent()
        ]);
    }

    get name() {
        return "Forms";
    }

    get targetURL() {
        return "https://docs.google.com/forms/?authuser=0"
        //return "https://forms.google.com";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/nogit/gr_zip_brenda/forms-icon.png";
    }

    get subtypeCSSClassName() {
        return "gr-forms-widget";
    }

}