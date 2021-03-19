import * as rs from 'reactstrap';

import { ConnectedFormAddEntry } from './FormAddEntry.js'
import { ConnectedPastEntries } from './PastEntries.js'
import { ConnectedFormLogin } from './FormLogin.js'
import { connectWithToken } from './../model/actions.js';

function Main({token}) {

  return (
    <rs.Container>
      <ConnectedFormLogin/>
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

