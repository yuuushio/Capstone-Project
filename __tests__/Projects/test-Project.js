// Tests for Project class

import {jest} from "@jest/globals";
import {Project} from "../../www-root/Projects/Project";
import {Label} from "../../www-root/Utilities/lib/ooGAPIAmalgamation.js";

jest.mock("../../www-root/Utilities/lib/ooGAPIAmalgamation.js");

/** @type {Project} */
let testSubject;

let serialisedExample = {
    'id': '1234567890123-xxxx',
    'name': 'testLabelID',
    'colour': 'crimson',
    'label': {
        'type': 'gr-gmail-label',
        'id': 'testLabelID',
        'name': 'testLabelName'
    },
    'calendar': null
};

describe("Project class", () => {

    beforeEach(() => {
        testSubject = new Project("test1", "crimson", new Label("testLabelID", "testLabelName"), null);
    })

    it('should initialise without problem', function () {
        expect(testSubject).toBeTruthy();
    });

    it('should be able to self destruct', () => {
        testSubject.selfDestruct();
        expect(testSubject).toHaveProperty("id", "0000");
    });

    it('should call callback on commit', () => {

        let fakeCallback = jest.fn();
        testSubject.registerModificationCallback(fakeCallback);
        testSubject.name = "anotherFancyName";
        testSubject.commit();

        expect(fakeCallback).toHaveBeenCalled();
        expect(fakeCallback).toHaveBeenCalledWith(testSubject);

    });

    it('should produce serialised object correctly', () => {

        let output = testSubject.serialise();
        expect(output).toHaveProperty('id');
        expect(output).toHaveProperty('name', 'test1');
        expect(output).toHaveProperty('colour', 'crimson');
        expect(output).toHaveProperty('label');

    });

    it('should be able to de-serialise', () => {

        let output = Project.generateFromSerialised(serialisedExample);

        expect(output).toBeTruthy();
        expect(output).toBeInstanceOf(Project);

    })


});