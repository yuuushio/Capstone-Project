// Tests for PositionManager

import {PositionRegistry} from "../../../www-root/widgets/Positions/PositionRegistry.js";
import {strict as assert} from 'assert';
import {PWWPosition} from "../../../www-root/widgets/Positions/PWWPosition.js";

// fake chrome.storage.sync
let getCalled = false;
let setCalled = false;
globalThis.chrome = {
    storage: {
        sync: {
            get: async () => {
                getCalled = true;
            },
            set: async () => {
                setCalled = true;
            }
        }
    },
    runtime: {
        error: null
    }
}

// fake widgets
let fakeWidget1 = {name: "fake-widget-1"};
let fakeWidget2 = {name: "fake-widget-2"};

/** @type {PositionRegistry} */
let subject;

describe('PositionRegistry Class', () => {

    beforeEach(() => {
        getCalled = false;
        setCalled = false;
        subject = new PositionRegistry();
        subject.setPositionByWidgetName(fakeWidget1.name, new PWWPosition(12, 34));
    });

    it('should return (0, 0) for never-seen widgets', () => {
        const output = subject.getPositionByWidgetName(fakeWidget2.name);
        assert(output instanceof PWWPosition);
        assert(output.x === 0);
        assert(output.y === 0);
    });

    it('should store and restore widget positions', async () => {
        const output = subject.getPositionByWidgetName(fakeWidget1.name);
        assert(output.x === 12);
        assert(output.y === 34);
    });

    it('should read from chrome storage', (done) => {
        setTimeout(() => {
            assert(getCalled);
            done();
        }, 10);
    });

    it('should commit and write to chrome storage', async () => {
        await subject.commit();
        assert(setCalled);
    })

});