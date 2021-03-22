import * as rs from 'reactstrap';
import { logout, addError, setData, updateToken } from './../model/actions.js';
import { connectWithToken } from './../model/actions.js';
import { GoogleLogin } from 'react-google-login';
import { fetchEntries } from './../model/api.js';
import { Youtube } from './Youtube.js';

function FormLogin({token, dispatch}) {

  const onGoogleLoginSuccess = response => {
    dispatch(updateToken(response.tokenId))
  }

  const onGoogleLoginFailure = response => {
   addError(dispatch, "Erro ao fazer login com Google");
  }

  if (!token) {
  return (
    <>
      <rs.Row>
        <rs.Col>
          <center>
            Acesse seu <b>Diário de Leitura</b>:<br/><br/>
          <GoogleLogin
            clientId="656765689994-f29hh63in3j1362mom3ek00ukcmru8jq.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={onGoogleLoginSuccess}
            onFailure={onGoogleLoginFailure}
            cookiePolicy={'single_host_origin'}
          />
          </center>
        </rs.Col>
      </rs.Row>
      <br/><br/>
      <rs.Row>
        <rs.Col md={{size: 8, offset: 2}}>
          Aprenda a usar:<br/><br/>
          <Youtube/>
        </rs.Col>
      </rs.Row>
    </>
  );
  } else {

  const handleRefresh = () => {
    setData(dispatch, null)
    fetchEntries(token, dispatch);
  };

  return (
    <rs.Form>

      <rs.Row>
        <rs.Col md={{size: 1, offset: 10}}>
          <rs.Button onClick={handleRefresh} color="secondary">Atualizar</rs.Button>
        </rs.Col>
        <rs.Col md={{size: 1}}>
          <rs.Button onClick={() => logout(dispatch) } color="secondary">Logout</rs.Button>
        </rs.Col>
      </rs.Row>

    </rs.Form>
  );
  }
}

export const ConnectedFormLogin = connectWithToken(FormLogin);
