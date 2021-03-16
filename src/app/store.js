import { configureStore } from '@reduxjs/toolkit';

export const TYPE_UPDATE_TOKEN = "TYPE_UPDATE_TOKEN";
export const TYPE_UPDATE_DATA = "TYPE_UPDATE_DATA";

const reducer = (state = {}, action) => {
  if (action.type === TYPE_UPDATE_TOKEN) {
    return {
      ...state,
      token: action.token
    }
  } else if (action.type === TYPE_UPDATE_DATA) {
    return {
      ...state,
      data: action.data
    }
  }
  return state
}

export default configureStore({
  reducer: reducer
});
