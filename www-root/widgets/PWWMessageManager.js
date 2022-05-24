// Subscription registry for all widgets

/** @type {{string : SubscriberCallback[]}} */
const callbacks = {};

/**
 * Publishes an event
 * @param widget {GRWidget}
 * @param eventName {string} name of event
 * @param param {Object} anything
 */
function publishEvent(widget, eventName, param) {

    if (!eventName) {
        throw new Error('Invalid event name');
    }

    /** @type SubscriberCallback[] */
    const thisCallbackList = callbacks[eventName];

    if (thisCallbackList) {
        for (const callback of thisCallbackList) {
            callback(widget, eventName, param);
        }
    }

}

/**
 * @callback SubscriberCallback
 * @param widget {GRWidget} the widget that initiated the event
 * @param eventName {string} the event name
 * @param param {Object} event parameter provided by the widget
 */

/**
 * Subscribes to a event of widgets
 * @param eventName {string} the event name
 * @param callback {SubscriberCallback}
 */
function subscribeToEvent(eventName, callback) {

    if (!eventName) {
        throw new Error('Invalid event name');
    }

    if (!callbacks[eventName]) {
        callbacks[eventName] = [];
    }

    if (!callbacks[eventName].includes(callback)) {
        callbacks[eventName].push(callback);
    }

}

export const PWWMessageManager = {publishEvent, subscribeToEvent};