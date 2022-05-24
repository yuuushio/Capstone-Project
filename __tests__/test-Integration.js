import {App} from "../www-root/App.js";
import {strict as assert} from 'assert';
import chrome from 'sinon-chrome';

jest.mock('../www-root/Utilities/lib/ooGAPIAmalgamation.js');

window.chrome = chrome;

describe('Entire app', () => {

    it('should initialise as a whole', async () => {
        await App.main();
        assert(true);
    })

});