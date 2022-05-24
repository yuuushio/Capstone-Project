// ElementRoot.js
// @ts-ignore
import { GoogleAuthManager } from "./Utilities/lib/ooGAPIAmalgamation.js";
// @ts-ignore
import { TabManager } from "./Tabbing/TabManager.js";
export class ElementRoot {
    /**
     * Creates the ElementRoot Object
     */
    constructor() {
        this.element = document.createElement('div');
        this.signInButtonAction = () => { };
        // init element
        this.element.innerHTML = contentHTMLTemplate;
        this.setTabManager(new TabManager());
        this.initGoogleAuth().then( /* ignored */);
        // add event listener to button
        this.element.querySelector('#gr-login-button')
            .addEventListener('click', this.signInButtonOnClick.bind(this));
    }
    /**
     * Set the tab manager for this modal window
     * @param newManager {TabManager}
     */
    setTabManager(newManager) {
        this.tabManager = newManager;
        this.element.appendChild(newManager.element);
    }
    /**
     * This will load the GAPI library and initialise the login button.
     * @returns {Promise<void>}
     */
    async initGoogleAuth() {
        await GoogleAuthManager.initialise();
        this._updateLogInButton();
    }
    /**
     * Click handler for the sign in/out button
     * @returns {Promise<void>}
     */
    async signInButtonOnClick() {
        await this.signInButtonAction();
    }
    /**
     * User asks to log in with Google.
     * @returns {Promise<void>}
     */
    async _logIn() {
        await GoogleAuthManager.logIn();
        this._updateLogInButton();
    }
    /**
     * User asks to log out with Google.
     * @returns {Promise<void>}
     */
    async _logOut() {
        await GoogleAuthManager.logOut();
        this._updateLogInButton();
    }
    /**
     * Updates the state of the log in button.
     * Requires an initialised GoogleAuthManager
     * @private
     */
    _updateLogInButton() {
        const button = this.element.querySelector('#gr-login-button');
        if (!GoogleAuthManager.signedIn) {
            // action should be sign in
            this.signInButtonAction = this._logIn.bind(this);
            button.innerText = 'Sign in with Google';
        }
        else {
            // action should be sign out
            this.signInButtonAction = this._logOut.bind(this);
            button.innerText = 'Log Out';
        }
    }
}
const contentHTMLTemplate = `
<div class="gr-title"><img src="./assets/images/logo.png"></div>
<div class="gr-login-button-div"><button id="gr-login-button">Loading Google...</button></div>
`;
