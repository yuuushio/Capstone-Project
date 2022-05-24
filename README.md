# Capstone Project

This is a web plugin designed to improve user productivity in Google's GSuite. It achieves this by producing a splash page when a user enters Gmail. This splash page serves as an improved navigation system throughout GSuite.
It also provides quick access to view, search and compose functionalities for each application.

The plugin will also block notifications from Google's Chat and Meet applications so as to minimise distractions.
Lastly, the plugin provides a means of sorting a user's emails into categories in a fun and interactive way via a web game on a separate tab on the splash page.

**Note:** *This project was initially on BitBucket - where all the CICD and TDD tools were integrated (equivalent of GitHub actions) by having each push/commit run through tests to ensure the build was successful and tests were passing.*

## Modules

This project manages its files with ES6 Modules.

All modules are in the `extension/static` directory. `App.js`'s `App.main()` provides an entry point. 
`Ignition.js` provides the logic to dynamically load all modules in one go, without requiring a `type=module` script tag on the web page.

## Usage

### Website

```bash
npm install -D
```

```bash
npm run server
```

Navigate to http://localhost:8000.

### Extension

Please use a chromium-based browser at this stage.

Go to about:extensions (chrome://extensions), turn on developer mode, and click "load unpacked". Then, select the "extension" folder under our codebase.

## Basic Functions
The home splash page will pop up when you enter Gmail. 
* Click `view` to be redirected into the home page of the respective GSuite application.
* Click the `search` icon to search for an item in that respective GSuite application.
* Click the `plus` icon to compose a new item for that respective GSuite application.
* Click the `cross` icon or anywhere outside the splash page to exit it.
* Drag any of the application widgets to customise your splash page. Its position will remain consistent across different 
browser tabs (You may need to refresh your browser to see its effects).
* Click the `Something else` tab to acess the game, which will sort your emails. Note that the game hasn't been integrated into the browser extension yet.