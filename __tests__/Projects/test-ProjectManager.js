// Tests for Project Manager

import {Project} from "../../www-root/Projects/Project";
import {ProjectManager} from "../../www-root/Projects/ProjectManager";
import {Label} from "../../www-root/Utilities/lib/ooGAPIAmalgamation.js";

jest.mock("../../www-root/Utilities/lib/ooGAPIAmalgamation.js");

let newProject;

describe('ProjectManager Class', () => {

    beforeEach(async function() {
        newProject = await ProjectManager.createProject(
            'testProject',
            'someCoolColour'
        );
    })

    it('should initialise', () => {
        expect(ProjectManager).toBeTruthy();
    });

    it('should create and accept additional projects', () => {

        expect(newProject).toBeTruthy();
        expect(newProject._updateCallback).toBeTruthy();
        expect(newProject).toBeInstanceOf(Project);
        expect(ProjectManager.hasProjectId(newProject.id)).toBeTruthy();

    });

});