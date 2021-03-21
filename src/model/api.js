import { showLoading, setData, addError } from './actions.js';
import * as actions from './actions.js';

const ENTRIES_ENDPOINT = "https://ikhizussk2.execute-api.us-east-1.amazonaws.com/dev/entries";

export function fetchEntries(token, dispatch) {

  const headers = new Headers();
  headers.append("Authorization", "Bearer " + token);

  const req = new Request(ENTRIES_ENDPOINT, {
    headers: headers
  }); 

  fetch(req)
    .then(resp => resp.json())
    .then(d => setData(dispatch, d))
    .catch(e => addError(dispatch, e));
}

export function addEntry(token, entry, data, dispatch) {

    const headers = new Headers();
    headers.append("Authorization", "Bearer " + token);

    const body = JSON.stringify(entry);

    const req = new Request(ENTRIES_ENDPOINT, {
      method: "POST",
      headers: headers,
      body: body
    }); 

  const onSuccess = d => {
    if (d.success) {
      actions.addEntry(dispatch, entry);
    } else {
      actions.addError(dispatch, "Error onSuccess do addEntry");
    }
  };

  fetch(req)
    .then(resp => resp.json())
    .then(d => onSuccess(d))
    .catch(e => addError(dispatch, e));
}

export function stopEntry(token, entry, data, dispatch) {

  const headers = new Headers();
  headers.append("Authorization", "Bearer " + token);

  const end_time = new Date().toISOString();

  const req = new Request(ENTRIES_ENDPOINT + "/" + entry.id, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify({
      end_time: end_time
    })
  }); 

  const onSuccess = d => {
    console.log("haia");
    if (d.success) {
      const newData = [...data];
      const idx = newData.findIndex(i => i.id === entry.id);
      const newEntry = {...newData[idx]};
      newEntry.end_time = end_time;
      newData[idx] = newEntry;
      console.log(newEntry);
      setData(dispatch, newData);
    } else {
      addError(dispatch, "Error onSuccess do stopEntry");
    }
  };

  const stopLoading = showLoading(dispatch, entry.id);

  fetch(req)
    .then(resp => resp.json())
    .then(d => onSuccess(d))
    .catch(e => addError(dispatch, e))
    .finally(stopLoading);
}

export function deleteEntry(token, id, data, dispatch) {

  const headers = new Headers();
  headers.append("Authorization", "Bearer " + token);

  const req = new Request(ENTRIES_ENDPOINT + "/" + id, {
    method: "DELETE",
    headers: headers
  }); 

  const onSuccess = d => {
    if (d.success) {
      const newData = data.filter(i => i.id !== id);
      setData(dispatch, newData);
    } else {
      addError(dispatch, "Error onSuccess do deleteEntry");
    }
  };

  const stopLoading = showLoading(dispatch, id);

  fetch(req)
    .then(resp => resp.json())
    .then(d => onSuccess(d))
    .catch(e => addError(dispatch, e))
    .finally(stopLoading);
}

export function patchProperty(data, token, entryId, propertyName, value, dispatch) {

  const headers = new Headers();
  headers.append("Authorization", "Bearer " + token);

  const body = {};
  body[propertyName] = value;

  const req = new Request(ENTRIES_ENDPOINT + "/" + entryId, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(body)
  }); 

  const onSuccess = d => {
    console.log("haia");
    if (d.success) {
      const newData = [...data];
      const idx = newData.findIndex(i => i.id === entryId);
      const newEntry = {...newData[idx]};
      newEntry[propertyName] = value;
      newData[idx] = newEntry;
      console.log(newEntry);
      setData(dispatch, newData);
    } else {
      addError(dispatch, "error onsuccess do patchproperty");
    }
  };

  const stopLoading = showLoading(dispatch, entryId);

  fetch(req)
    .then(resp => resp.json())
    .then(d => onSuccess(d))
    .catch(e => addError(dispatch, e))
    .finally(stopLoading);
}
