// Popup Page Mainframe Script
import { SnoozeService } from "../modules/SnoozeService.js";
import { getStateDescription } from "./SnoozeStateOutputter.js";
const ALERT_FADE_OUT_MS = 2000;
const submitButton = document.querySelector('.gr-ext-confirm-button');
const cancelButton = document.querySelector('.gr-ext-cancel-button');
const alertSpan = document.querySelector('.gr-ext-alert');
const statusTagSpan = document.querySelector('.gr-ext-status-display');
/**
 * Gets the value of the checked radio input
 */
function getRadioValue() {
    const checkedRadio = document.querySelector('input[name="duration"]:checked');
    if (!checkedRadio) {
        return null;
    }
    return parseInt(checkedRadio.value);
}
/**
 * Shows a prompt next to the button, which disappears after ALERT_FADE_OUT_MS
 * @param message - message to display
 */
function showAlertTag(message) {
    alertSpan.innerText = message;
    alertSpan.style.display = '';
    // hide it after fade out ms
    setTimeout(() => {
        alertSpan.style.display = 'none';
    }, ALERT_FADE_OUT_MS);
}
/**
 * Click handler of the confirm button
 */
function confirmButtonOnClick() {
    // sanity check: must have selected something
    const selectedValue = getRadioValue();
    if (!selectedValue) {
        showAlertTag('You must choose something');
        return;
    }
    // conversion needed: second -> millisecond
    SnoozeService.setRelativeSnoozeTime(selectedValue * 1000);
    showAlertTag('done.');
    updateSnoozeDisplay();
}
function cancelButtonOnClick() {
    SnoozeService.removeSnooze();
    updateSnoozeDisplay();
}
/**
 * Updates the snooze display state
 */
function updateSnoozeDisplay() {
    // the basics
    const stateDescription = getStateDescription();
    statusTagSpan.innerText = stateDescription;
    // set tag to indigo if it's not snoozed
    if (stateDescription === 'Not snoozed') {
        statusTagSpan.classList.remove('w3-amber');
        statusTagSpan.classList.add('w3-indigo');
    }
    else {
        statusTagSpan.classList.remove('w3-indigo');
        statusTagSpan.classList.add('w3-amber');
    }
}
// main script
updateSnoozeDisplay();
submitButton.onclick = confirmButtonOnClick;
cancelButton.onclick = cancelButtonOnClick;
