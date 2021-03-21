import * as store from './store.js';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

export const updateToken = token => {
  return {
    type: store.TYPE_UPDATE_TOKEN,
    token: token
  }
}

const sort = data => {
  if (!data || data.length === 0) {
    return data;
  }
  const sorted = data.sort((a, b) => {
    if (a.start_time < b.start_time) {
      return 1;
    }
    return -1;
  });
  return sorted;
};

export const setData = (dispatch, data) => {
  data = sort(data);
  dispatch({
    type: store.TYPE_UPDATE_DATA,
    data: data
  });
}

export const addError = (dispatch, error) => {
  error = error.message || error;
  dispatch({
    type: store.TYPE_ADD_ERROR,
    error: error,
    date: new Date()
  });
}

export const clearErrors = (dispatch) => {
  dispatch({
    type: store.TYPE_CLEAR_ERRORS
  });
}

export const showLoading = (dispatch, entryId) => {
  const requestId = uuidv4();

  dispatch({
    type: store.TYPE_SHOW_LOADING,
    entryId: entryId,
    requestId: requestId
  });

  return () => {
    dispatch({
      type: store.TYPE_STOP_LOADING,
      entryId: entryId,
      requestId: requestId
    });
  }
}

export const connectWithToken = fn => connect((state) => {return {token: state.token}})(fn);
export const connectWithData = fn => connect((state) => {return {data: state.data}})(fn);
export const connectWithErrors = fn => connect((state) => {return {errors: state.errors}})(fn);
