import * as rs from 'reactstrap';

import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as store from './app/store.js';

import { ConnectedMain } from './Main.js';
import { ConnectedFormLogin } from './FormLogin.js';
import { setData, updateToken } from './actions.js';
import { fetchEntries } from './api.js';

function App() {
  return <ConnectedMain/>
}

export const connectWithToken = fn => connect((state) => {return {token: state.token}})(fn);
export const connectWithData = fn => connect((state) => {return {data: state.data}})(fn);

function useInput(placeholder) {
  const [value, setValue] = useState("")
  return [
    <rs.Input placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)}/>,
    value,
    setValue,
  ]
}

function useCheckbox(label, start, dependencies) {
  const [value, setValue] = useState(start)

  const decoratedSetValue = value => {
    dependencies.map(i => i(""));
    setValue(value);
  };

  const input = (
    <rs.FormGroup check>
      <rs.Label check>
        <rs.Input type="checkbox" checked={value} onChange={(e) => decoratedSetValue(e.target.checked)} />{' '}
        {label}
      </rs.Label>
    </rs.FormGroup>
  );

  return [
    input,
    value,
    decoratedSetValue,
  ]
}

export const ConnectedFormAddEntry = connectWithData(connectWithToken(FormAddEntry));

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

const TimeRFC3339 = (usarHorarioManual, retornarAgora, data, hora) => {
  if (usarHorarioManual) {
    try {
      return dateAndTimeToDate(data, hora).toISOString();
    } catch (e) {
      return ""
    }
  }
  if (retornarAgora) {
    return new Date().toISOString();
  }
  return ""
};

function FormAddEntry({token, data, dispatch}) {

  const [fimDataInput, fimDataValue, setFimDataValue] = useInput("Data (DD/MM/AAAA)");
  const [fimHorarioInput, fimHorarioValue, setFimHorarioValue] = useInput("Hora (HH:MM)");
  const [fimPaginaInput, fimPaginaValue, setFimPaginaValue] = useInput("Página em que parei");

  const [inicioDataInput, inicioDataValue, setInicioDataValue] = useInput("Data (DD/MM/AAAA)");
  const [inicioHorarioInput, inicioHorarioValue, setInicioHorarioValue] = useInput("Hora (HH:MM)");
  const [jaPareiCheckbox, jaPareiValue, setJaPareiValue] = useCheckbox("Fim retroativo", false, [setFimDataValue, setFimHorarioValue, setFimPaginaValue])

  const [livroInput, livroValue, setLivroValue] = useInput("Livro que vou ler agora");
  const [inicioPaginaInput, inicioPaginaValue, setInicioPaginaValue] = useInput("Página em que vou começar");
  const [jaComeceiCheckbox, jaComeceiValue, setJaComeceiValue] = useCheckbox("Início retroativo", false, [setInicioDataValue, setInicioHorarioValue, setJaPareiValue])

  const handleSubmit = (e) => {
    const entry = {
      book_id: livroValue,
      start_time: TimeRFC3339(jaComeceiValue, true, inicioDataValue, inicioHorarioValue),
      end_time: TimeRFC3339(jaPareiValue, false, fimDataValue, fimHorarioValue),
      start_location: parseInt(inicioPaginaValue, 10) || null,
      end_location: parseInt(fimPaginaValue, 10) || null
    }
    addEntry(token, entry, data, dispatch);

    setLivroValue("");
    setInicioDataValue("");
    setInicioHorarioValue("");
    setInicioPaginaValue("");
    setFimDataValue("");
    setFimHorarioValue("");
    setFimPaginaValue("");
    setJaComeceiValue(false);
    setJaPareiValue(false);

    e.preventDefault();
  };

  return (
    <rs.Form onSubmit={handleSubmit}>

      <rs.Card>
        <rs.CardBody>

          <rs.Row>
            <rs.Col sm={4}>
                {livroInput}
            </rs.Col>

            <rs.Col sm={4}>
              {inicioPaginaInput}
            </rs.Col>

            <rs.Col sm={2}>
              {jaComeceiCheckbox}
            </rs.Col>
          </rs.Row>


          {jaComeceiValue && (
            <>
          <rs.Badge color="warning">Início retroativo</rs.Badge>

          <rs.Row>
            <rs.Col sm={3}>
              {inicioDataInput}
            </rs.Col>
            <rs.Col sm={3}>
              {inicioHorarioInput}
            </rs.Col>
            <rs.Col sm={2}>
              {jaPareiCheckbox}
            </rs.Col>
            </rs.Row>
            </>

            )}

          {jaPareiValue && (
            <>
          <rs.Badge color="warning">Fim retroativo</rs.Badge>
          <rs.Row>
            <rs.Col sm={3}>
              {fimDataInput}
            </rs.Col>
            <rs.Col sm={3}>
              {fimHorarioInput}
            </rs.Col>
            <rs.Col sm={6}>
              {fimPaginaInput}
            </rs.Col>
          </rs.Row>
            </>
          )}


          <rs.Button color="dark">Adicionar registro</rs.Button>

        </rs.CardBody>
      </rs.Card>

    </rs.Form>
  )
}

const ENTRIES_ENDPOINT = "https://ikhizussk2.execute-api.us-east-1.amazonaws.com/dev/entries";

export const ConnectedPastEntries = connectWithData(connectWithToken(PastEntries));

function PastEntries({token, data, dispatch}) {

  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    if (token) {
      if (!shouldFetch) {
        return;
      }
      setShouldFetch(false);
      fetchEntries(token, dispatch);
    }
  }, [token, shouldFetch, setShouldFetch, dispatch]);

  return (
    <>
    <rs.Table>
      <thead>
        <tr>
          <th>Livro</th>
          <th>Comecei às</th>
          <th>Comecei na página</th>
          <th>Parei às</th>
          <th>Parei na página</th>
          <th>Operações</th>
        </tr>
      </thead>
      {(data && data.length && (
        <tbody>
          {data.map(i => (
            <ConnectedEntry
              token={token}
              entry={i}
              key={i.id}
            />
          ))}
        </tbody>
      )) || (<tbody></tbody>)}
      </rs.Table>
    </>
  );

}

export const ConnectedEntry = connectWithData(Entry);

const pad = (num, len) => {
    var str = num + "";
    while (str.length < len) {
        str = "0" + str;
    }
    return str;
}

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

const intParser = str => {
  return parseInt(str, 10);
};

const timeParser = str => {
  const parts = str.split(" "); // Esperado espaço vazio entre data e hora
  try {
    return dateAndTimeToDate(parts[0], parts[1]).toISOString();
  } catch (e) {
    return null;
  }
};

export const ConnectedEditableProperty = connectWithToken(EditableProperty);

function EditableProperty({token, entryId, propertyName, children, dataParser}) {
  const [value, setValue] = useState(children);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef();

  const handleClick = () => {
    setIsEditing(!isEditing);
  };
  
  const onSubmit = (e) => {
    if (!dataParser) {
      dataParser = (e) => e;
    }
    patchProperty(token, entryId, propertyName, dataParser(value));
    setIsEditing(false);
    e.preventDefault();
  };

  useEffect(() => {
    if (isEditing) {
      ref.current.focus();
    };
  });

  const handleFocus = (event) => event.target.select();

  return (
    <>
    {!isEditing && (
      <td onClick={handleClick}>{value}</td>
    )}
    {isEditing && (
      <td>
        <rs.Form onSubmit={onSubmit}>
          <rs.Input value={value} onChange={e => setValue(e.target.value)} innerRef={ref} onFocus={handleFocus}/>
        </rs.Form>
      </td>
    )}
    </>
  );
}

export default App;

function addEntry(token, entry, data, dispatch) {

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
      const newData = [...data];
      entry.id = d.id;
      newData.push(entry);
      setData(dispatch, newData);
    }
  };

  fetch(req).then(resp => resp.json().then(d => onSuccess(d)));
}

function stopEntry(token, entry, data, dispatch) {

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
    if (d.success) {
      const newData = [...data];
      const idx = newData.findIndex(i => i.id === entry.id);
      const newEntry = {...newData[idx]};
      newEntry.end_time = end_time;
      newData[idx] = newEntry;
      setData(dispatch, newData);
    }
  };

  fetch(req).then(resp => resp.json().then(d => onSuccess(d)));
}

function deleteEntry(token, id, data, dispatch) {

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
    }
  };

  fetch(req).then(resp => resp.json().then(d => onSuccess(d)));
}

function patchProperty(token, entryId, propertyName, value) {

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
    if (d.success) {
      // Nothing to do yet
    }
  };

  fetch(req).then(resp => resp.json().then(d => onSuccess(d)));
}
