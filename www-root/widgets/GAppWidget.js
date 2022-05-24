// PW Widgets
import interact from "../Utilities/lib/interactjs-amalgamation.js";
import {DefaultState} from "./DisplayState/DisplayStates.js";
import {GRWidget} from "./GRWidget.js";
import {PWWPosition} from "./Positions/PWWPosition.js";
import {PWWMessageManager} from "./PWWMessageManager.js";
import {GmailAdapter} from "../Utilities/lib/ooGAPIAmalgamation.js";

/**
 * @property {HTMLElement} element
 * @property {string} iconSrc
 * @property {string} iconText
 * @property {PWWPosition} position
 * @abstract
 */
export class GAppWidget extends GRWidget {

    position = new PWWPosition(0, 0)
    state = null

    /*type{WComponent}*/
    components

    // short hand: get sub element
    $gse(selector) {
        return this.element.querySelector(selector);
    }

    /**
     * targetURL info. Will jump here when it's clicked on.
     * @abstract
     * @returns {string}
     */
    get targetURL() {}

    /**
     * iconURL info. Returns a string of the icon's URL.
     * @abstract
     * @returns {string}
     */
    get iconURL() {}

    /**
     * A class name specifically for this type of widget
     * @returns {string}
     * @abstract
     */
    get subtypeCSSClassName() {}

    /**
     * Constructor of GRWidget
     * @param components {[WComponent]}
     */
    constructor(components=[]) {
        super();
        this.element.innerHTML = widgetHTMLTemplate;

        // fill in element details
        this._initElementAttributes();
        this.setState(DefaultState);
        this._registerInteraction();

        // register with Message Manager
        PWWMessageManager.publishEvent(this, "created", null);

        this.components = components;
        components.forEach((c) => {
            this.element.insertAdjacentElement('beforeend', c.element);
        });

    }

    _initElementAttributes() {
        this.element.classList.add("gr-app-cont");
        this.element.classList.add(this.subtypeCSSClassName);
        this.$gse('.gr-icon-div').querySelector('img').src = this.iconURL;
        this.$gse('.gr-app-text').innerText = this.name;
    }

    _registerInteraction() {

        const interaction = interact(this.element);
        interaction.draggable({
            autoScroll: true,
            listeners: {
                move: this.onDragMove.bind(this)
            }
        });
        interaction.on('doubletap', this.onDoubleClick.bind(this));

        const addClickAction = (selector, action) => {
            this.$gse(selector).addEventListener('click', action);
        }

        addClickAction('.gr-view', this.onViewClick.bind(this));

        this.setState(DefaultState);

    }

    /**
     * Called when this widget is clicked
     * @param event
     */
    onDoubleClick(event) {
        location.href = this.targetURL;
    }

    /**
     * Called when the view button is clicked
     */
    onViewClick() {
        this.openUserURL(this.targetURL);
    }

    /**
     * Listener for drag move
     * @param event {any} The interact.js event type
     */
    onDragMove(event) {
        const newPosition = this.position.applyVector(event.dx, event.dy);
        this.movePosition(newPosition);
    }

    /**
     * Move this widget around
     * This will set the element's CSS translate, and emit an event.
     * WARNING - this will overwrite all other transform style tag on this.element
     * @param newPosition {PWWPosition}
     */
    movePosition(newPosition) {
        this.position = newPosition;
        this.element.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
        PWWMessageManager.publishEvent(this, "positionChanged", null);
    }

    /**
     * Change this instance's state. Will mutate this element's CSS classes
     * @param {DisplayState} newState
     */
    setState(newState) {
        /** @type {DisplayState} */
        const oldState = this.state;
        this.state = newState;

        // remove old css classes
        if (oldState) {
            oldState.CSSClassList.forEach(
                className => {
                    this.element.classList.remove(className);
                }
            );
        }

        // add new classes
        newState.CSSClassList.forEach(
            className => {
                this.element.classList.add(className);
            }
        );

        PWWMessageManager.publishEvent(this, "stateChanged", null);

    }

    /**
     * Adjusts the given url so that it matches the current user's account
     * @param url {String}
     * @returns {Promise<String>}
     */
    async createUserURL(url) {
        const address = await GmailAdapter.getEmailAddress();
        return url.replace('0', address);
    }

    /**
     * Opens the given url in with the current user's account
     * @param url {String}
     * @returns {Promise<String>}
     */
    async openUserURL(url) {
        const newUrl = await this.createUserURL(url);
        window.open(newUrl, '_blank', 'noopener');
    }

}

const widgetHTMLTemplate = `
<div class="gr-side-line"></div>
               
<!-- common text; class should be fine to categorize this-->
<div class="gr-icon-div">
    <img src="">
</div>

<div class="gr-app-text">
    <p>Email</p>
</div>
<!-- css for view - gna be the same for all-->
<button type="button" class="gr-view">
    View
</button>

`;
