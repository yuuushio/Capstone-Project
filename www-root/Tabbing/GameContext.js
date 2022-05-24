// Class file for GameContext

import {TabContext} from "./TabContext.js";

const gameHref = './Game/index.html';
const nullHref = 'about:blank';

export class GameContext extends TabContext {

    constructor(name = 'Game') {
        super(name);
        this.contentElement.innerHTML = contentHTMLTemplate;
        this.iframe = this.contentElement.querySelector('iframe');
    }

    loadGame() {
        this.iframe.src = gameHref;
    }

    unloadGame() {
        this.iframe.src = nullHref;
    }

    onHide() {
        super.onHide();
        this.unloadGame();
    };

    onShow() {
        super.onShow();
        this.loadGame();
    }

}

const contentHTMLTemplate = `
<iframe class="gr-game-iframe" height="620px" width="1020px" src="${nullHref}"></iframe>
`;