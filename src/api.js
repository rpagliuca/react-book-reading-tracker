import { setData, updateToken } from './actions.js';

const ENTRIES_ENDPOINT = "https://ikhizussk2.execute-api.us-east-1.amazonaws.com/dev/entries";

export function fetchEntries(token, dispatch) {

  const headers = new Headers();
  headers.append("Authorization", "Bearer " + token);

  const req = new Request(ENTRIES_ENDPOINT, {
    headers: headers
  }); 

  fetch(req).then(resp => resp.json().then(d => setData(dispatch, d)));
}

