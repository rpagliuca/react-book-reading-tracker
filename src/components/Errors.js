import * as rs from 'reactstrap';
import { clearErrors, connectWithErrors } from './../model/actions.js';
import React, { useState } from 'react';

function Errors({errors, dispatch}) {
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

  const handleClear = () => {
    clearErrors(dispatch);
  }

  let isFirst = true;

  return (
    <>
    <rs.Badge color="danger">Log de erros</rs.Badge>
    <rs.ListGroup>
      {visibleErrors.length && visibleErrors.map(i => (
        <rs.ListGroupItem>
          <rs.Row>
            <rs.Col className="log-date" md={3}>
              {i.date}
            </rs.Col>
            <rs.Col>
              {i.error}
            </rs.Col>
            {isFirst && (
              <>
              {errors.length > 1 && (
              <rs.Col md={2}>
                <rs.Button onClick={toggleExpanded} color="light">{(!expanded && "Ver mais") || "Ver menos"}</rs.Button>
              </rs.Col>
              )}
              <rs.Col md={2}>
                <rs.Button color="warning" onClick={handleClear}>Limpar log</rs.Button>
              </rs.Col>
              </>
            )}
              {isFirst = false}
            </rs.Row>
          </rs.ListGroupItem>
      ))}
        </rs.ListGroup>
    </>
  );
}

export const ConnectedErrors = connectWithErrors(Errors);
