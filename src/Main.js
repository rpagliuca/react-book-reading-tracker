import * as rs from 'reactstrap';

import { ConnectedFormAddEntry, ConnectedPastEntries } from './App.js'
import { ConnectedFormLogin } from './FormLogin.js'
import { connect } from 'react-redux';

export const connectWithToken = fn => connect((state) => {return {token: state.token}})(fn);

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

