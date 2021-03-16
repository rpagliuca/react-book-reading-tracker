import { configureStore } from '@reduxjs/toolkit';

export const TYPE_UPDATE_TOKEN = "TYPE_UPDATE_TOKEN";

const reducer = (state = {}, action) => {
  if (action.type === TYPE_UPDATE_TOKEN) {
    return {
      ...state,
      token: action.token
    }
  }
  return state
}

export default configureStore({
  reducer: reducer
});
