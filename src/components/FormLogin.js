import * as rs from 'reactstrap';
import { addError, setData, updateToken } from './../model/actions.js';
import { connectWithToken } from './../model/actions.js';
import { GoogleLogin } from 'react-google-login';
import { fetchEntries } from './../model/api.js';

function FormLogin({token, dispatch}) {

  const onGoogleLoginSuccess = response => {
    dispatch(updateToken(response.tokenId))
  }

  const onGoogleLoginFailure = response => {
   addError(dispatch, "Erro ao fazer login com Google");
  }

  if (!token) {
  return (
      <rs.Row>
        <rs.Col md={{size: 2, offset: 5}}>
          <GoogleLogin
            clientId="656765689994-f29hh63in3j1362mom3ek00ukcmru8jq.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={onGoogleLoginSuccess}
            onFailure={onGoogleLoginFailure}
            cookiePolicy={'single_host_origin'}
          />
        </rs.Col>
      </rs.Row>
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
          <rs.Button onClick={() => dispatch(updateToken(""))} color="secondary">Logout</rs.Button>
        </rs.Col>
      </rs.Row>

    </rs.Form>
  );
  }
}

export const ConnectedFormLogin = connectWithToken(FormLogin);
