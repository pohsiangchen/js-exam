/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import formReducer from 'redux-form/es/reducer';

import javascript from 'models/javascript/reducer';
import react from 'models/react/reducer';
import login from 'models/login/reducer';
import category from 'models/category/reducer';
import tape from 'models/tape/reducer';
import _console from 'models/console/reducer';
import tab from 'models/tab/reducer';
import room from 'models/room/reducer';
import record from 'models/record/reducer';
import code from 'models/code/reducer';
import question from 'models/question/reducer';

/**
 * Merges the dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    javascript,
    react,
    login,
    category,
    tape,
    console: _console,
    tab,
    room,
    record,
    code,
    question,
    form: formReducer,
    ...injectedReducers,
  });
}
