import * as rs from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { ConnectedEntry } from './Entry.js';
import { fetchEntries, } from './api.js';
import { connectWithData, connectWithToken } from './actions.js';

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

