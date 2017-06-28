/**
 * @file Desciption:
 * @author huanghaiping(huanghaiping02@baidu.com)
 * Created on 17/6/27
 */

import {connections, alerts} from './connection/reducers';
import {noteCards} from  './notebooksApp/reducers';
import {screenMode, cells} from './notebook/reducers';

const initialState = {
    noteCards: [],
    connections: [],
    alerts: {
        items: [],
        lastKey: -1
    },
    screenMode: {
        fullScreen: false,
        cellId: ''
    },
    cells: []
};


export function operation(state = initialState, action) {
    return {
        connections: connections(state.connections, action),
        alerts: alerts(state.alerts, action),
        noteCards: noteCards(state.noteCards, action),
        screenMode: screenMode(state.screenMode, action),
        cells: cells(state.cells, action)
    };
}