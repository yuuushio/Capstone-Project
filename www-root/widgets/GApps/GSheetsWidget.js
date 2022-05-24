import {SheetsAdapter} from "../../Utilities/lib/ooGAPIAmalgamation.js";
import {GAppWidget} from "../GAppWidget.js";
import {DocsComposeComponent} from "../WComponents/ComposeComponent/DocsComposeComponent.js";
import {ActiveSearchComponent} from "../WComponents/SearchComponent/ActiveSearchComponent.js";

const SEARCH_URL = 'https://docs.google.com/spreadsheets/?authuser=0&q=$1';

export class GSheetsWidget extends GAppWidget{

    constructor() {
        super([
            new ActiveSearchComponent(SEARCH_URL),
            new DocsComposeComponent(SheetsAdapter)
        ]);
    }

    get name() {
        return "Sheets";
    }

    get targetURL() {
        return "https://docs.google.com/spreadsheets/?authuser=0";
        //return "https://drive.google.com/drive/u/0/search?q=type:spreadsheet";
        //return "https://sheets.google.com";
    }

    get searchURLTemplate() {
        return "https://docs.google.com/spreadsheets/?authuser=0&q=$1";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/icons/gsheets.png";
    }

    get subtypeCSSClassName() {
        return "gr-sheet-widget";
    }

}