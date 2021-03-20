import * as rs from 'reactstrap';
import React, { useRef, useEffect, useState } from 'react';
import { patchProperty } from './../model/api.js';
import { connectWithData, connectWithToken } from './../model/actions.js';
export const ConnectedEditableProperty = connectWithData(connectWithToken(EditableProperty));

function EditableProperty({data, token, entryId, propertyName, children, dataParser, dispatch}) {
  console.log(children);
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
    patchProperty(data, token, entryId, propertyName, dataParser(value), dispatch);
    setIsEditing(false);
    e.preventDefault();
  };

  useEffect(() => {
    if (isEditing) {
      ref.current.focus();
    }
    setValue(children);
  }, [isEditing, children]);

  const handleFocus = (event) => event.target.select();

  return (
    <>
    {!isEditing && (
      <td onClick={handleClick}>{value}</td>
    )}
    {isEditing && (
      <td>
        <rs.Form onSubmit={onSubmit}>
          <rs.Input value={value || ""} onChange={e => setValue(e.target.value)} innerRef={ref} onFocus={handleFocus}/>
        </rs.Form>
      </td>
    )}
    </>
  );
}
