import * as rs from 'reactstrap';

import React, { useState } from 'react';

export function useInput(placeholder, onBlur, reference) {
  const [value, setValue] = useState("")
  return [
    <rs.Input onBlur={onBlur} placeholder={placeholder} ref={reference} value={value} onChange={(e) => setValue(e.target.value)}/>,
    value,
    setValue,
  ]
}

export function useCheckbox(label, start, dependencies) {
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

