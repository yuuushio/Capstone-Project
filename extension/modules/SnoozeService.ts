// Config Service
// Manages the snooze time and the persistent storage thereof

const LOCALSTORAGE_KEY = "GR_EXT_SNOOZE";

class SnoozeServiceImpl {

    snoozeTime!: Date;

    constructor() {
        this.readStoredSnoozeDate();
    }

    private readStoredSnoozeDate() {
        // extract snooze time from localStorage
        // if there is none, set snooze time to 0 (1970-01-01)
        const dateString = localStorage.getItem(LOCALSTORAGE_KEY);

        if (dateString) {
            this.snoozeTime = new Date(parseInt(dateString));
        } else {
            this.snoozeTime = new Date(0);
        }
    }

    writeToLocalStorage() {
        const dateStr = `${this.snoozeTime.getTime()}`;
        localStorage.setItem(LOCALSTORAGE_KEY, dateStr);
    }

    /**
     * Sets snooze until time to an absolute time
     * @param time - the target "snooze until" time
     */
    setAbsoluteSnoozeTime(time: Date) {
        this.snoozeTime = time;
        this.writeToLocalStorage();
    }

    /**
     * Sets snooze time to this number of milliseconds after now
     * @param duration - the duration, in milliseconds
     */
    setRelativeSnoozeTime(duration: number) {
        this.snoozeTime = _getRelativeDate(duration);
        this.writeToLocalStorage();
    }

    getSnoozeUntilTime(): Date {
        this.readStoredSnoozeDate();
        return this.snoozeTime;
    }

    /**
     * Removes the snooze.
     */
    removeSnooze() {
        this.snoozeTime = new Date(0);
        this.writeToLocalStorage();
    }

    /**
     * Returns whether the instance is currently snoozing
     */
    isCurrentlySnoozing(): boolean {
        this.readStoredSnoozeDate();
        const currentTimeMS = Date.now();
        return currentTimeMS < this.snoozeTime.getTime();
    }

    /**
     * Gets how many milliseconds are left before the snooze expires
     * Returns null if it's not snoozing
     */
    getMillisecondsLeft(): number|null {

        this.readStoredSnoozeDate();

        // sanity check
        if (!this.isCurrentlySnoozing()) {
            return null;
        }

        const currentEpochMS = Date.now();
        return this.snoozeTime.getTime() - currentEpochMS;

    }

}

// static utility functions

function _getRelativeDate(duration: number) {
    const currentTimeMS = new Date().getTime();
    const newTimeMS = currentTimeMS + duration;
    return new Date(newTimeMS);
}

export const SnoozeService = new SnoozeServiceImpl();