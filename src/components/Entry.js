import * as rs from 'reactstrap';
import { ConnectedEditableProperty } from './EditableProperty.js';
import { deleteEntry, stopEntry } from './../model/api.js';
import { connectWithData } from './../model/actions.js';
import { useState, useRef } from 'react';
import { useInput } from './../model/hooks.js';

export const ConnectedEntry = connectWithData(Entry);

function Entry({token, entry, data, dispatch}) {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [stopDate, setStopDate] = useState("");
  const chronoInputRef = useRef();

  const handleDeleteConfirm = () => {
    deleteEntry(token, entry.id, data, dispatch);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteModal = e => {
    setShowDeleteModal(true);
    e.preventDefault();
  };

  const handleStopConfirm = (stopPage) => {
    stopEntry(token, entry, stopDate, stopPage, dispatch);
    setShowStopModal(false);
  };

  const handleStopCancel = () => {
    setShowStopModal(false);
  };

  const handleStopModal = e => {
    chronoInputRef.select();
    setShowStopModal(true);
    setStopDate(new Date().toISOString());
    e.preventDefault();
  };

  const isIncomplete = !(
    entry &&
    entry.book_id &&
    entry.start_time &&
    entry.end_time &&
    entry.start_location &&
    entry.end_location
  );

  return (
    <tr className={(entry.loadingRequests && entry.loadingRequests.length && "entry-loading") || (isIncomplete && "entry-incomplete")}>
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
        <DeleteModal handleCancel={handleDeleteCancel} handleConfirm={handleDeleteConfirm} showModal={showDeleteModal} />
        <StopModal handleCancel={handleStopCancel} handleConfirm={handleStopConfirm} showModal={showStopModal} stopDate={stopDate} />
        <rs.Button color="light" onClick={(e) => handleDeleteModal(e, entry.id)}>🗑️</rs.Button>
        {!entry.end_time && <rs.Button color="light" onClick={(e) => handleStopModal(e, entry)}>⏱</rs.Button>}
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

function StopModal({showModal, handleConfirm, handleCancel, stopDate}) {

  const [input, value] = useInput("Em que página você parou?", null, chronoInputRef);

  const handleSubmit = e => {
    handleConfirm(value);
    e.preventDefault();
  }

  return (
  <rs.Modal isOpen={showModal}>
  <rs.Form onSubmit={handleSubmit}>
    <rs.ModalHeader>Confirmar</rs.ModalHeader>
    <rs.ModalBody>
        <rs.FormGroup>
          <rs.Label>
            Horário de parada: {prettyDate(stopDate)}
          </rs.Label>
        </rs.FormGroup>
        <rs.FormGroup>
          {input}
        </rs.FormGroup>
    </rs.ModalBody>
    <rs.ModalFooter>
      <rs.Button color="primary" type="submit">Confirmar parada</rs.Button>{' '}
      <rs.Button color="secondary" onClick={handleCancel}>Cancelar</rs.Button>
    </rs.ModalFooter>
  </rs.Form>
  </rs.Modal>
  );
}

function DeleteModal({showModal, handleConfirm, handleCancel}) {
  return (
  <rs.Modal isOpen={showModal}>
    <rs.ModalHeader>Confirmar</rs.ModalHeader>
    <rs.ModalBody>
      Deseja mesmo excluir?
    </rs.ModalBody>
    <rs.ModalFooter>
      <rs.Button color="primary" onClick={handleConfirm}>Confirmar exclusão</rs.Button>{' '}
      <rs.Button color="secondary" onClick={handleCancel}>Cancelar</rs.Button>
    </rs.ModalFooter>
  </rs.Modal>
  );
}
