import * as rs from 'reactstrap';
import { connectWithErrors } from './../model/actions.js';
import React, { useState } from 'react';

function Errors({errors}) {
  const [expanded, setExpanded] = useState(false);

  if (!errors || !errors.length) {
    return null;
  }

  let visibleErrors = [...errors].reverse();

  if (!expanded && errors.length) {
    visibleErrors = [visibleErrors[0]];
  }

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <rs.ListGroup onClick={toggleExpanded}>
      {visibleErrors.length && visibleErrors.map(i => (
        <rs.ListGroupItem>[{i.date}] {i.error}</rs.ListGroupItem>
      ))}
    </rs.ListGroup>
  );
}

export const ConnectedErrors = connectWithErrors(Errors);
