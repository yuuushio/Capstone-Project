// Default tab content

import {InDockState} from "../widgets/DisplayState/DisplayStates.js";
import {PositionManager} from "../widgets/Positions/PositionManager.js";
import {WidgetBasedTabContext} from "./WidgetBasedTabContext.js";

export class DefaultTab extends WidgetBasedTabContext {

    /** @type {GAppWidget[]} */
    dockedWidgets = [];

    constructor(name) {

        super(name);
        this.contentElement.innerHTML = contentHTMLTemplate;

        // gather some convenience shorthands
        this._leftCol = this.contentElement.querySelector('#gr-left-column');
        this._rightCol = this.contentElement.querySelector('#gr-right-column');
        this._icon = this.contentElement.querySelector('.gr-circle-content');

        // register action for the icon
        this._icon.addEventListener('click', this.resetAllWidgetPositions.bind(this));

    }

    addWidget(newWidget) {
        // super.addWidget(newWidget);
        this.addMainPanelWidget(newWidget);
    }

    /**
     * Add widget to the main space (above the footer)
     * @param newWidget {GRWidget}
     */
    addMainPanelWidget(newWidget) {

        // check if we already have it
        if (this.widgets.includes(newWidget)) {
            console.warn('Warning: trying to add a newWidget that already exists');
            return;
        }

        this.widgets.push(newWidget);

        // TODO -- delegate this to GRWidget class, or merge the CSS class with .gr-widget
        newWidget.element.classList.add('gr-wid');

        // insert new widget to left or right column alternatively
        const insertionCol = this.widgets.length % 2 === 1 ? this._leftCol : this._rightCol;
        insertionCol.insertAdjacentElement('beforeend', newWidget.element);

    }

    /**
     * Add widget to the footer (dock)
     * @param newWidget {GRWidget}
     */
    addFooterWidget(newWidget) {
        super.addWidget(newWidget);
        this.contentElement.querySelector('.gr-footer').insertAdjacentElement('beforeend', newWidget.element);
    }

    /**
     * Moves a widget to the dock
     * @param targetWidget {GAppWidget}
     */
    dockWidget(targetWidget) {

        // change the widgets state
        targetWidget.setState(InDockState);

        // remove targetWidget from widgets array
        this.removeWidget(targetWidget);

        // add the widget to the dockedWidgets array
        this.dockedWidgets.push(targetWidget);
        this.contentElement.querySelector('.gr-footer').insertAdjacentElement('beforeend', targetWidget.element);

    }

    /**
     * Resets all widgets' positions
     */
    async resetAllWidgetPositions() {

        // ask the user first
        const response = window.confirm('Are you sure you want to reset all widgets\' positions?');
        if (!response) {
            return;
        }

        await PositionManager.resetAll();
        location.reload();

    }

}

const contentHTMLTemplate = `
<div class="gr-inner">
    <div id="gr-left-column">
    </div>

    <div id="gr-right-column">
    </div>
</div>
<div class="gr-footer">
    <div class="gr-main-dock"></div>
    <div class="gr-circle-spacer">
        <div class="gr-circle-container">
            <button class="gr-circle-content">
            Icon
            </button>
        </div>
    </div>
</div>
`;
