// Tests for Message Manager

import {PWWMessageManager} from "../../www-root/widgets/PWWMessageManager.js";
import {strict as assert} from "assert";

describe('Widget Message Manager', () => {

    it('should notify all subscribers of an event', () => {

        let counter = 0;

        PWWMessageManager.subscribeToEvent("testEvent", () => {
            counter += 1;
        });
        PWWMessageManager.subscribeToEvent("testEvent", () => {
            counter += 2;
        });

        PWWMessageManager.publishEvent(null, "testEvent", null);

        assert(counter === 3);

    });

    it('should forward info about calling widget and param', (done) => {

        const callback = (widget, eventName, param) => {
            assert(widget === 'meow');
            assert(eventName === 'testEvent');
            assert(param === 'meow');
            done();
        };

        PWWMessageManager.subscribeToEvent('testEvent', callback);
        PWWMessageManager.publishEvent('meow', 'testEvent', 'meow');

    });

    it('should not crash on a event that has no subscriber', () => {

        const invalidEventName = "l98d0cgb.uruceg2lc.huesn't,boaelkhrbnth;dnt";
        PWWMessageManager.publishEvent(null, invalidEventName, null);

    });

    it('should throw on falsy event names', () => {

        let passing = false;
        try {
            PWWMessageManager.publishEvent(null, null, null);
        } catch (e) {
            passing = true;
        }
        assert(passing);

    });

});