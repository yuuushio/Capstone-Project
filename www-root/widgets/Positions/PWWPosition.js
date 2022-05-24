// File for PWWPosition Class

export class PWWPosition {

    /**
     * Constructor for PWWPosition. It's just a struct.
     * @param x {number} relative position, in the x axis.
     * @param y {number} relative position, in the y axis.
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Apply a deviation vector to this point, and return a new one.
     * @param dx {number} deviation in the x axis
     * @param dy {number} deviation in the y axis
     * @returns {PWWPosition} a new position object
     */
    applyVector(dx, dy) {
        return new PWWPosition(this.x + dx, this.y + dy)
    }

}