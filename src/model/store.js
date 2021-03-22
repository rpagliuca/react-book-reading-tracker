import { configureStore } from '@reduxjs/toolkit';

export const TYPE_UPDATE_TOKEN = "TYPE_UPDATE_TOKEN";
export const TYPE_UPDATE_DATA = "TYPE_UPDATE_DATA";
export const TYPE_ADD_ERROR = "TYPE_ADD_ERROR";
export const TYPE_CLEAR_ERRORS = "TYPE_CLEAR_ERRORS";
export const TYPE_SHOW_LOADING = "TYPE_SHOW_LOADING";
export const TYPE_STOP_LOADING = "TYPE_STOP_LOADING";
export const TYPE_FILTER_BY_BOOK = "TYPE_FILTER_BY_BOOK";
export const TYPE_LOGOUT = "TYPE_LOGOUT";
export const TYPE_ADD_ENTRY = "TYPE_ADD_ENTRY";
export const TYPE_DELETE_ENTRY = "TYPE_DELETE_ENTRY";
export const TYPE_PATCH_ENTRY = "TYPE_PATCH_ENTRY";

const reducer = (state = {errors: [], token: null, data: null, filterByBook: null}, action) => {

  let newState;
  let newData;
  let errors;
  let data;
  let idx;
  let item;
  let loadingRequests;

  if (action.type === TYPE_UPDATE_TOKEN) {
    return {
      ...state,
      token: action.token,
      data: null
    }
  } else if (action.type === TYPE_UPDATE_DATA) {
    return {
      ...state,
      data: action.data
    }
  } else if (action.type === TYPE_ADD_ERROR) {
    newState = {...state};
    errors = [...state.errors];
    errors.push({error: action.error, date: action.date.toISOString()});
    newState.errors = errors;
    return newState;
  } else if (action.type === TYPE_SHOW_LOADING) {
    data = [...state.data];
    idx = data.findIndex(i => {
      return i.id === action.entryId;
    });
    item = {...data[idx]};
    loadingRequests = [...(item.loadingRequests || [])];
    loadingRequests.push(action.requestId);
    item.loadingRequests = loadingRequests;
    data[idx] = item;
    return {
      ...state,
      data: data
    }
  } else if (action.type === TYPE_STOP_LOADING) {
    data = [];
    if (state.data && state.data.length) {
      data = [...state.data];
    }
    idx = data.findIndex(i => {
      return i.id === action.entryId;
    });
    item = {...data[idx]};
    loadingRequests = [...(item.loadingRequests || [])].filter(reqId => reqId !== action.requestId);
    item.loadingRequests = loadingRequests;
    data[idx] = item;
    return {
      ...state,
      data: data
    }
  } else if (action.type === TYPE_CLEAR_ERRORS) {
    newState = {...state};
    newState.errors = [];
    return newState;
  } else if (action.type === TYPE_FILTER_BY_BOOK) {
    return {
      ...state,
      filterByBook: action.book,
    }
  } else if (action.type === TYPE_LOGOUT) {
    return {};
  } else if (action.type === TYPE_ADD_ENTRY) {
    newData = [...state.data];
    newData.push(action.entry);
    return {
      ...state,
      data: sort(newData),
    }
  } else if (action.type === TYPE_DELETE_ENTRY) {
    newData = state.data.filter(i => i.id !== action.entryId);
    return {
      ...state,
      data: sort(newData),
    }
  } else if (action.type === TYPE_PATCH_ENTRY) {
    newData = [...state.data];
    idx = newData.findIndex(i => {
      return i.id === action.entryId;
    });
    item = {...newData[idx]};
    item[action.propertyName] = action.propertyValue;
    newData[idx] = item;
    return {
      ...state,
      data: newData
    }
  }
  return state
}

export default configureStore({
  reducer: reducer
});

const sort = data => {
  if (!data || data.length === 0) {
    return data;
  }
  const sorted = [...data].sort((a, b) => {
    if (a.start_time < b.start_time) {
      return 1;
    }
    return -1;
  });
  return sorted;
};
