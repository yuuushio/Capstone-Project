// Tests for ProjectWidget

import {Project} from "../../www-root/Projects/Project.js";
import {Label} from "../../www-root/Utilities/lib/ooGAPIAmalgamation.js";
import {ProjectWidget} from "../../www-root/widgets/ProjectWidget.js";

let fakeProject = new Project('un proyecto fantástico', 'color', new Label('id', 'name'), null);

/** @type {ProjectWidget} */
let testSubject;

describe('ProjectWidget TypeScript class', () => {

    beforeEach(() => {
        testSubject = new ProjectWidget(fakeProject);
    });

    it('should initialise correctly', () => {
        expect(testSubject).toBeTruthy();
    });

    it('should register all five buttons', () => {

        const elements = [
            testSubject.infoButton,
            testSubject.calendarButton,
            testSubject.renameButton,
            testSubject.editButton,
            testSubject.trashButton
        ];

        elements.forEach(element => {
            expect(element).toBeTruthy();
            expect(element).toBeInstanceOf(HTMLImageElement);
        });

    });

    it('should have a name that\'s the same as the project, notwithstanding non-ASCII characters', () => {
        expect(testSubject.name).toBe('un proyecto fantástico');
    });



});