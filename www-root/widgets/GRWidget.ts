// Generic Widget
// a thin wrapper around DOM element

export abstract class GRWidget {

    element: HTMLElement = document.createElement('div');

    /**
     * Name info. Should be user friendly.
     * @abstract
     * @returns {string}
     */
    abstract get name(): string;

}