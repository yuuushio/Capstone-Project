import {SlidesAdapter} from "../../Utilities/lib/ooGAPIAmalgamation.js";
import {GAppWidget} from "../GAppWidget.js";
import {DocsComposeComponent} from "../WComponents/ComposeComponent/DocsComposeComponent.js";
import {ActiveSearchComponent} from "../WComponents/SearchComponent/ActiveSearchComponent.js";

const SEARCH_URL = 'https://docs.google.com/presentation/?authuser=0&q=$1';

export class GSlidesWidget extends GAppWidget{

    constructor() {
        super([
            new ActiveSearchComponent(SEARCH_URL),
            new DocsComposeComponent(SlidesAdapter)
        ]);
    }

    get name() {
        return "Slides";
    }

    get targetURL() {
        return "https://docs.google.com/presentation/?authuser=0";
        //return "https://drive.google.com/drive/u/0/search?q=type:presentation";
        //return "https://slides.google.com";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/icons/gslides.png";
    }

    get subtypeCSSClassName() {
        return "gr-slides-widget";
    }

}