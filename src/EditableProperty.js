import * as rs from 'reactstrap';
import React, { useRef, useEffect, useState } from 'react';
import { patchProperty } from './api.js';
import { connectWithToken } from './actions.js';
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

