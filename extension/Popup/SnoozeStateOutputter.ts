// SnoozeState Outputter

import {SnoozeService} from "../modules/SnoozeService.js";

/**
 * This function liaisons with the SnoozeService and returns a user-friendly description of the status
 * Example: Time left: 8:15:22
 * Example: Not snoozed
 * Example: Long time to go
 */
export function getStateDescription(): string {

    if (!SnoozeService.isCurrentlySnoozing()) {
        return 'Not snoozed';
    } else {
        const msLeft = SnoozeService.getMillisecondsLeft()!;
        return `Snoozed for ${parseSecondsLeft(msLeft / 1000)}`;
    }

}

function parseSecondsLeft(sec: number): string {

    const hoursLeft = Math.floor(sec / 3600);

    // handle intervals by length
    if (hoursLeft > 24) {
        return 'a long time';
    } else if (hoursLeft > 1) {
        return `over ${hoursLeft} hours`;
    } else if (hoursLeft > 0) {
        return `over 1 hour`;
    }

    // still not returned? go to minutes
    const minutesLeft = Math.round(sec / 60);
    const minuteNounForm = minutesLeft > 1 ? 'minutes' : 'minute';
    return `about ${minutesLeft} ${minuteNounForm}`;

}