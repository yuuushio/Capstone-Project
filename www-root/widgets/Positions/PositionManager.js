// Position Manager
// This class will interact with the config storage to provide for persistence in positions

import {PWWMessageManager} from "../PWWMessageManager.js";
import {PositionRegistry} from "./PositionRegistry.js";

let registry = new PositionRegistry();
let commitTimerID;

// Just a thin wrapper around registry
export class PositionManager {

    /**
     * Callback for when a widget is created
     * @param widget {GAppWidget}
     */
    static onWidgetCreated(widget) {

        // get stored position for the widget
        const storedPosition = registry.getPositionByWidgetName(widget.name);
        if (storedPosition.x !== 0 || storedPosition.y !== 0) {
            widget.movePosition(storedPosition);
        }

    }

    /**
     * Callback for when a widget is moved
     * @param widget {GRWidget}
     */
    static onWidgetMoved(widget) {

        const newPosition = widget.position;
        registry.setPositionByWidgetName(widget.name, newPosition);

        // set a timer to commit in 1 second. Cancel the last one if already set.
        clearTimeout(commitTimerID);
        commitTimerID = setTimeout(() => {
            registry.commit().then();
        }, 1000);

    }

    /**
     * Set things up (especially the subscriptions)
     * Need to call this *before* any widget is created
     */
    static async initialise() {
        await registry.getFromConfigStorage();
        PWWMessageManager.subscribeToEvent("created", this.onWidgetCreated.bind(this));
        PWWMessageManager.subscribeToEvent("positionChanged", this.onWidgetMoved.bind(this));
    }

    /**
     * Resets all data from the registry
     * @returns {Promise<void>}
     */
    static async resetAll() {
        registry.resetAll();
        await registry.commit();
    }

}