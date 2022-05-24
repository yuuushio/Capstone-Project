// Test for DisplayState class

import {strict as assert} from 'assert';
import {DisplayState} from "../../../www-root/widgets/DisplayState/DisplayState.js";

/** @type {DisplayState} */
let instance;

describe('DisplayState Class', () => {

    beforeEach(() => {
        instance = new DisplayState('Mock object', ['invalid-class']);
    });

    it('should initialise', () => {
        assert(instance);
    });

})
