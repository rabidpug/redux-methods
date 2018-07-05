# Redux Methods

![GitHub last commit](https://img.shields.io/github/last-commit/rabidpug/redux-methods.svg)
[![Build Status](https://ci.jcuneo.com/job/redux-methods/job/master/badge/icon)](https://ci.jcuneo.com/job/redux-methods/job/master/)
[![Coverage Status](https://coveralls.io/repos/github/rabidpug/redux-methods/badge.svg)](https://coveralls.io/github/rabidpug/redux-methods)

[![GitHub package version](https://img.shields.io/github/package-json/v/rabidpug/redux-methods.svg)](https://github.com/rabidpug/redux-methods/blob/master/CHANGELOG.md)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/rabidpug/redux-methods/blob/master/LICENSE)

[![npm](https://img.shields.io/npm/v/redux-methods/latest.svg)](https://www.npmjs.com/package/redux-methods)
[![npm downloads](https://img.shields.io/npm/dw/redux-methods.svg)](https://www.npmjs.com/package/redux-methods)

![GitHub repo size in bytes](https://img.shields.io/github/repo-size/badges/shields.svg)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/redux-methods.svg)](https://www.npmjs.com/package/redux-methods)

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Advanced Usage](#advanced-usage)
- [TODO](#todo)

**No more boilerplate for common actions. Define your initial state and common actions once, then access the actions anywhere in one object.**

```bash
npm install redux-methods
```

OR

```bash
yarn add redux-methods
```

## Getting Started

- [Define your initial state](#define-your-initial-state)
- [Define your action methods](#define-your-action-methods)
- [Initialize the enhancer](#initialize-the-enhancer)

### Define your initial state

```javascript
// initialState.js

const initialState = {
  ui: {
    isOnline: true,
    isSidebarOpen: true,
    errorMessage: '',
  },
  inProgress: {
    isGettingProfile: false,
  },
  user: {
    profile: {}
  }

  export default initialState;
```

OR

```javascript
// ui.js

export const ui = {
  isOnline: true,
  isSidebarOpen: true,
  errorMessage: '',
};

//... similar for inProgress.js, user.js
```

```javascript
//initialState.js

export { ui } from './ui';
export { inProgress } from './inProgress';
export { user } from './user';
```

```javascript
// in store.js

import * as initialState from './initialState';

//... etc
```

### Define your action methods

_Methods should be defined in camel case, and not conflict with any properties in your initial state. These methods will be your action types which can be dispatched on any property in your initial state._

```javascript
// methods.js

/**
 * @description - each action method is called with the below, and must return
 * the new value for the slice
 * @param {*} payload - The payload provided to the action method creator
 * @param {*} slice - reference to the slice of state provided by the path of the action
 * method creator. Mutation should be avoided.
 * @param {*} initial - reference to the slice of initial state provided by the path of the
 * action method creator. Mutation should be avoided.
 */

export const setValue = payload => payload;
export const increment = (payload, slice) => slice + payload;
export const decrement = (payload, slice) => slice - payload;
export const addById = (payload, slice) => ({ ...slice, [payload.id]: payload });
export const reset = (payload, slice, initial) => initial;
```

#### Optional - Define other methods

_You can define additional methods such as thunks, selectors, or other simple actions that you don't want shared with all properties as an object of functions. These will all be accessible in the methods object at their respective path. Each object of additional methods will be merged in to the methods object._

```javascript
// thunks.js

export const fetchProfile = payload => dispatch => dispatch(someAction(payload));
//async action here

// selectors.js

export const selectProfile = state => state.user.profile; //selector here
```

### Initialize the enhancer

_Pass in your defined methods, and any additional objects containing functions you want to have access to in the methods object._

```javascript
// store.js

import { createStore } from 'redux';
import initialState from './initialState'; // or import * as initialState
import { methodsEnhancer } from 'redux-methods';
import * as methods from './methods';
import * as thunks from './thunks';
import * as selectors from './selectors';

/**
 * @description - methodsEnhancer initialises redux-methods
 * @param {{}} methods - The methods you have defined which will become your
 * action types available at every property defined in your initialState.
 * @param {{}} ...additionalMethods - additional arguments should be objects
 * containing additional methods, eg thunks, selectors, or other action creators.
 */

const store = createStore(reducer, initialState, methodsEnhancer(methods, thunks, selectors));

export default store;
```

#### Optional - using with namespaced reducers

_If you are using namespaced reducers (for example, using combineReducers) the initialState created by redux-methods will cause an error (unexpected keys) - to work around this, spread the createPassthroughReducers function with the initialState as its argument to create a reducer for each namespace in your defined initialState that simply returns the state._

```javascript
// reducer.js

import { combineReducers } from 'redux';
import { createPassthroughReducers } from 'redux-methods';
import initialState from './initialState';

const reducer = combineReducers({
  ...createPassthroughReducers(initialState),
  someReducer: state => state,
});

export default reducer;
```

## Usage

```javascript
// someContainer.js

import { connect } from 'react-redux';
import methods from 'redux-methods';
import someComponent from './someComponent';

const mapStateToProps = state => ({
  profile: methods.selectProfile(state),
});

const mapDispatchToProps = {
  fetchProfile: methods.fetchProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(someComponent);

// thunks.js

import methods from 'redux-methods';

export const fetchProfile = payload => dispatch => {
  const {
    inProgress: { isGettingProfile },
    ui: { errorMessage },
    user: { profile },
  } = methods;

  dispatch(isGettingProfile.set(true));

  return axios
    .get(`api.domain.com/profile/${payload}`)
    .then(res => {
      dispatch(profile.set(res.data));
      dispatch(isGettingProfile.set(false));
    })
    .catch(e => dispatch(errorMessage(e.message)));
};
```

## Advanced Usage

_Two methods are provided at the root level of the methods object - tutti and custom. See below for the previous example rewritten using these methods._

**`methods.tutti`** - this method allows you to perform multiple actions in a single dispatch.

_By using this method you will need to look at the action itself in Redux Dev Tools to see which actions were performed._

**`methods.custom`** - this method allows you to perform any of your defined method actions on a path that you were unable to define in your initialState. It will create the path if it doesn't exist.

```javascript
// someContainer.js

import { connect } from 'react-redux';
import methods from 'redux-methods';
import someComponent from './someComponent';

const mapStateToProps = state => ({
  profile: methods.selectProfile(state),
});

const mapDispatchToProps = {
  fetchProfile: methods.fetchProfile,
  updateName: methods.custom.set('user.profile.name', 'Bob'),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(someComponent);

// thunks.js

import methods from 'redux-methods';

export const fetchProfile = payload => dispatch => {
  const {
    inProgress: { isGettingProfile },
    tutti,
    ui: { errorMessage },
    user: { profile },
  } = methods;

  dispatch(isGettingProfile.set(true));

  return axios
    .get(`api.domain.com/profile/${payload}`)
    .then(res => {
      dispatch(tutti(profile.set(res.data), isGettingProfile.set(false)));
    })
    .catch(e => dispatch(errorMessage(e.message)));
};
```

## Explanation

The methodsEnhancer function does two things.

Firstly, it creates an object with the same deep properties as the provided initialState, excluding final values. Each property contains an action creator for each of the provided methods.

### `Example`

```javascript
const initialState = {
  ui: {
    inProgress: {
      isGettingProfile: false,
    },
    isOnline: true,
  },
};
const methods = {
  increment: (payload, slice) => slice + payload,
  reset: (payload, slice, initial) => initial,
  setValue: payload => payload,
};

// using the above initialState and methods passed to methodsEnhancer, the
// imported methods object would be as below:

methods = {
  custom: {
    increment: (path, payload) => ({
      path,
      payload,
      type: '@@redux-methods/INCREMENT',
    }),
    reset: (path, payload) => ({
      path,
      payload,
      type: '@@redux-methods/RESET',
    }),
    setValue: (path, payload) => ({
      path,
      payload,
      type: '@@redux-methods/SET_VALUE',
    }),
  },
  tutti: payload => ({
    payload,
    type: '@@redux-methods/TUTTI',
  }),
  ui: {
    increment: payload => ({
      path: 'ui',
      payload,
      type: '@@redux-methods/INCREMENT',
    }),
    reset: payload => ({
      path: 'ui',
      payload,
      type: '@@redux-methods/RESET',
    }),
    setValue: payload => ({
      path: 'ui',
      payload,
      type: '@@redux-methods/SET_VALUE',
    }),
    inProgress: {
      increment: payload => ({
        path: 'ui.inProgress',
        payload,
        type: '@@redux-methods/INCREMENT',
      }),
      reset: payload => ({
        path: 'ui.inProgress',
        payload,
        type: '@@redux-methods/RESET',
      }),
      setValue: payload => ({
        path: 'ui.inProgress',
        payload,
        type: '@@redux-methods/SET_VALUE',
      }),
      isGettingProfile: {
        increment: payload => ({
          path: 'ui.inProgress.isGettingProfile',
          payload,
          type: '@@redux-methods/INCREMENT',
        }),
        reset: payload => ({
          path: 'ui.inProgress.isGettingProfile',
          payload,
          type: '@@redux-methods/RESET',
        }),
        setValue: payload => ({
          path: 'ui.inProgress.isGettingProfile',
          payload,
          type: '@@redux-methods/SET_VALUE',
        }),
      },
    },
    isOnline: {
      increment: payload => ({
        path: 'ui.isOnline',
        payload,
        type: '@@redux-methods/INCREMENT',
      }),
      reset: payload => ({
        path: 'ui.isOnline',
        payload,
        type: '@@redux-methods/RESET',
      }),
      setValue: payload => ({
        path: 'ui.isOnline',
        payload,
        type: '@@redux-methods/SET_VALUE',
      }),
    },
  },
};
```

Secondly, it creates a root-level reducer. This reducer checks if the action type is a defined method. If it isn't, it passes the action on to the default reducer.

Otherwise, it reduces down to the slice of state (and initial state) determined by the path value, then passes those slices and payload to the defined method which matches the action type.

## TODO

- Check for and disallow duplicate paths
- Clean up readme
