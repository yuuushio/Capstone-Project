import {GAppWidget} from "../GAppWidget.js";
import {ComposeComponent} from "../WComponents/ComposeComponent/ComposeComponent.js";
import {ActiveSearchComponent} from "../WComponents/SearchComponent/ActiveSearchComponent.js";

const SITES_COMPOSE_URL = 'https://sites.google.com/u/0/create';
const SEARCH_URL = 'https://sites.google.com/?authuser=0&q=$1';

export class GSitesWidget extends GAppWidget{

    constructor() {
        super([
            new ActiveSearchComponent(SEARCH_URL),
            new ComposeComponent()
        ]);
    }

    get name() {
        return "Sites";
    }

    get targetURL() {
        return "https://sites.google.com/u/1/new?authuser=0";
        //return "https://sites.google.com";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/nogit/gr_zip_brenda/sites-icon.png";
    }

    get subtypeCSSClassName() {
        return "gr-sites-widget";
    }

}