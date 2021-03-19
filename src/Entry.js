import * as rs from 'reactstrap';
import { ConnectedEditableProperty } from './EditableProperty.js';
import { deleteEntry, stopEntry } from './api.js';
import { connectWithData } from './actions.js';

export const ConnectedEntry = connectWithData(Entry);

function Entry({token, entry, data, dispatch}) {

  const handleDelete = (e, id) => {
    if (id) {
      deleteEntry(token, id, data, dispatch);
    };
    e.preventDefault();
  };

  const handleStop = (e, entry) => {
    if (entry.id) {
      stopEntry(token, entry, data, dispatch);
    };
    e.preventDefault();
  };

  return (
    <tr>
      <ConnectedEditableProperty entryId={entry.id} propertyName="book_id">
        {entry.book_id}
      </ConnectedEditableProperty>
      <ConnectedEditableProperty entryId={entry.id} propertyName="start_time" dataParser={timeParser}>
        {prettyDate(entry.start_time)}
      </ConnectedEditableProperty>
      <ConnectedEditableProperty entryId={entry.id} propertyName="start_location" dataParser={intParser}>
        {entry.start_location}
      </ConnectedEditableProperty>
      <ConnectedEditableProperty entryId={entry.id} propertyName="end_time" dataParser={timeParser}>
        {prettyDate(entry.end_time)}
      </ConnectedEditableProperty>
      <ConnectedEditableProperty entryId={entry.id} propertyName="end_location" dataParser={intParser}>
        {entry.end_location}
      </ConnectedEditableProperty>
      <td>
        <rs.Button color="light" onClick={(e) => handleDelete(e, entry.id)}>🗑️</rs.Button>
        {!entry.end_time && <rs.Button color="light" onClick={(e) => handleStop(e, entry)}>⏱</rs.Button>}
      </td>
    </tr>
  );
}

const timeParser = str => {
  const parts = str.split(" "); // Esperado espaço vazio entre data e hora
  try {
    return dateAndTimeToDate(parts[0], parts[1]).toISOString();
  } catch (e) {
    return null;
  }
};

const prettyDate = dateStr => {
  const timestamp = Date.parse(dateStr);
  if (timestamp) {
    const date = new Date();
    date.setTime(timestamp);
    return pad(date.getDate(), 2) + "/" + pad((date.getMonth()+1), 2) + "/" + date.getFullYear() + " "
      + pad(date.getHours(), 2) + ":" + pad(date.getMinutes(), 2);
  }
  return "";
}

const intParser = str => {
  return parseInt(str, 10);
};

const dateAndTimeToDate = (data, hora) => {
  var data_parts = data.split("/");
  var hora_parts = hora.split(":");
  var dt = new Date(
    parseInt(data_parts[2], 10), // ano
    parseInt(data_parts[1], 10) - 1, // mês começa com 0
    parseInt(data_parts[0], 10), // dia
    parseInt(hora_parts[0], 10), // hora
    parseInt(hora_parts[1], 10), // minuto
  );
  return dt
}

const pad = (num, len) => {
    var str = num + "";
    while (str.length < len) {
        str = "0" + str;
    }
    return str;
}
