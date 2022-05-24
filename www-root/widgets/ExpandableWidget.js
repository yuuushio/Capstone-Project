// Expandable Widgets

import {GAppWidget} from "./GAppWidget.js";

class ExpandableWidget extends GAppWidget {

    constructor() {
        super();
    }

    movePosition(newPosition) {

    }

    onDoubleClick(event) {

    }

    /**
     * Expand the expandable part of this widget
     * @abstract
     */
    collapse() {

    }

    /**
     * Restore the widget to its initial state
     * @abstract
     */
    expand() {

    }

}