import {GAppWidget} from "../GAppWidget.js";
import {ComposeComponent} from "../WComponents/ComposeComponent/ComposeComponent.js";
import {SearchComponent} from "../WComponents/SearchComponent/SearchComponent.js";

const VIEW_URL = `https://chat.google.com/?authuser=0`

export class GChatWidget extends GAppWidget {

    constructor() {
        super([
            new SearchComponent(),
            new ComposeComponent()
        ]);
    }

    get name() {
        return "Chat";
    }

    get targetURL() {
        return VIEW_URL;
        //return "https://chat.google.com";
    }

    get iconURL(){
        return "https://static.riley.love/gsuite-redux/nogit/gr_zip_brenda/chat-icon.png";
    }

    get subtypeCSSClassName() {
        return "gr-chat-widget";
    }

}