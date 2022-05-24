// HTML Template for ProjectDetailsTab
// Single Purpose File

export const projectDetailsTabHTMLTemplate = `

<h3>Editing Project <span class="gr-project-tab-name">PROJECT ID</span></h3>

<form class="m-3">

    <div class="form-group m-2">
        <label>
            Name:<br />
            <input class="gr-project-tab-input-name form-control" type="text"/>
            <small class="form-text text-muted">Does not have to be unique</small>
        </label>
    </div>



    <div class="form-group m-2">
        <label>
            Colour: <br />
            <input type="color" class="gr-project-tab-input-colour form-control" />
        </label>
    </div>



    <div class="form-check m-2 gr-project-tab-checkboxes">
        <label class="form-check-label" style="display: none">
            <input class="form-check-input gr-project-tab-input-create-label" type="checkbox" disabled checked />
            Create an email label
        </label>
        <br />
        <label class="form-check-label">
            <input class="form-check-input gr-project-tab-input-create-calendar" type="checkbox" checked />
            Create a calendar
        </label>
    </div>

</form>
`;