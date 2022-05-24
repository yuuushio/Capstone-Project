// DisplayStates Constant Instances
// These Instances Should Not be Changed

/*
 *  --------------------------------------------------------------------------------
 * | NOTE - see wiki page                                                           |
 * | https://bitbucket.org/soft3888-2020/gsuite-redux/wiki/Memo:%20DisplayStates    |
 * | for more info                                                                  |
 * | Please update that page too if you make any changes to this file.              |
 *  --------------------------------------------------------------------------------
 */

import {DisplayState} from "./DisplayState.js";

export const DefaultState = new DisplayState(
    'Default',
    []
);

export const ExpandedState = new DisplayState(
    'Expanded',
    ['gr-widget-expanded']
);

export const DraggingState = new DisplayState(
    'Dragging',
    ['gr-widget-dragging']
);

export const DroppingState = new DisplayState(
    'Dropping',
    ['gr-widget-dropping']
);

export const InDockState = new DisplayState(
    'InDock',
    ['gr-widget-indock']
);