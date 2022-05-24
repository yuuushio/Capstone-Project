# Capstone Project

This is a web plugin designed to improve user productivity in Google's GSuite. It achieves this by producing a splash page when a user enters Gmail. This splash page serves as an improved navigation system throughout GSuite.
It also provides quick access to view, search and compose functionalities for each application.

The plugin will also block notifications from Google's Chat and Meet applications so as to minimise distractions.
Lastly, the plugin provides a means of sorting a user's emails into categories in a fun and interactive way via a web game on a separate tab on the splash page.

**Note:** *This project was initially on BitBucket - where all the CICD and TDD tools were integrated (equivalent of GitHub actions) by having each push/commit run through tests to ensure the build was successful and tests were passing.*

**Note:** *Original commit history has been removed due to privacy purposes.*

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

## Other Info
- The implementation consists of extensive Object Oriented JavaScript Design in a `App` -> `Tab` -> `Widget` -> `Dom HTML/CSS` hierarchy.
- Game was built on Phaser 3 web game engine.

### Systematic Process of Work & XP Practices
Throughout the duration, each team member took on a number of the **Extreme Programming** roles. These roles, the role rotation schedule and their responsibilities were documented separately in the wiki from the very first week. Roles were rotated/handed over during out weekly Team Meeting.

#### Pair Programming
At the half-way point, the team split up into groups of 2-3 to conduct pair programming. This was due to the increse in demands by the client, thus requiring a lot more decision making and learning.

#### Code Styles
The group followed the Google JavaScript and HTML/CSS style guides as much as possible. This took extra effort but made the code more uniform and readable. The JavaScript code also follows object-oriented principles wherever applicable. This was achieved by using different design patterns and separating objects into classes. As a result, it allowed for more modularity which made for easier testing and debugging. Furthermore, the code was more flexible through the use of polymorphism and inheritance, new widget classes could be easily created and deleted depending on scope changes without affecting other classes.

#### Version Control/Issue Tracking
The team conducted version control using Git. They made sure to work on side branches when implementing new features and only push to master-branch by submitting pull requests. This allowed the master branch to only contain working code at all times. It was also easy to conduct code reviews as changes of each commit were clearly visible.

#### Test-driven Development
The tests were set up to run automatically with each push through Bitbucket’s pipeline, other group members could quickly and easily see if their changes had broken any other part of the code.