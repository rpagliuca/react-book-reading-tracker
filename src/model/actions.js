import * as store from './store.js';
import { connect } from 'react-redux';

export const updateToken = token => {
  return {
    type: store.TYPE_UPDATE_TOKEN,
    token: token
  }
}

export const setData = (dispatch, data) => {
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

export const connectWithToken = fn => connect((state) => {return {token: state.token}})(fn);
export const connectWithData = fn => connect((state) => {return {data: state.data}})(fn);
export const connectWithErrors = fn => connect((state) => {return {errors: state.errors}})(fn);
