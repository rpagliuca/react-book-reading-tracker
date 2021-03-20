import { configureStore } from '@reduxjs/toolkit';

export const TYPE_UPDATE_TOKEN = "TYPE_UPDATE_TOKEN";
export const TYPE_UPDATE_DATA = "TYPE_UPDATE_DATA";
export const TYPE_ADD_ERROR = "TYPE_ADD_ERROR";

const reducer = (state = {errors: [], token: null, data: null}, action) => {
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
    const newState = {...state};
    const errors = [...state.errors];
    errors.push({error: action.error, date: action.date});
    newState.errors = errors;
    return newState;
  }
  return state
}

export default configureStore({
  reducer: reducer
});