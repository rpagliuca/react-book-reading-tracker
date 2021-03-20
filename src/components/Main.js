import * as rs from 'reactstrap';

import { ConnectedFormAddEntry } from './FormAddEntry.js'
import { ConnectedPastEntries } from './PastEntries.js'
import { ConnectedFormLogin } from './FormLogin.js'
import { ConnectedErrors } from './Errors.js'
import { connectWithToken } from './../model/actions.js';

function Main({token}) {

  return (
    <rs.Container>
      <ConnectedFormLogin/>
      <ConnectedErrors/>
      {token && (
        <>
        <ConnectedFormAddEntry/>
        <ConnectedPastEntries/>
        </>
      )}
    </rs.Container>
  );
}

export const ConnectedMain = connectWithToken(Main);
