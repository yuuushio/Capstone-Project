// Widget Based Context

import {TabContext} from "./TabContext.js";
import type {GRWidget} from "../widgets/GRWidget";

export class WidgetBasedTabContext extends TabContext {

    widgets: GRWidget[] = []

    /**
     * Adds a widget to this instance
     * @param newWidget {GRWidget}
     */
    addWidget(newWidget: GRWidget) {
        this.widgets.push(newWidget);
        this.contentElement.insertAdjacentElement('beforeend', newWidget.element);
    }

    /**
     * Removes a widget
     * @param targetWidget {GRWidget}
     */
    removeWidget(targetWidget: GRWidget) {

        // check whether we have this targetWidget
        if (!this.widgets.includes(targetWidget)) {
            console.warn('Warning: trying to remove a widget that we don\'t have');
            return;
        }

        this.widgets = this.widgets.filter(widget => widget !== targetWidget);  // remove targetWidget from array
        this.contentElement.removeChild(targetWidget.element);

    }

}