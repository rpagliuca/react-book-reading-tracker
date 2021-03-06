import * as rs from 'reactstrap';
import { addEntry } from './../model/api.js';
import { connectWithCurrentBook, connectWithData, connectWithToken } from './../model/actions.js';
import { useEffect } from 'react';
import { useInput, useCheckbox } from './../model/hooks.js';

export const ConnectedFormAddEntry = connectWithCurrentBook(connectWithData(connectWithToken(FormAddEntry)));

function FormAddEntry({token, data, currentBook, dispatch}) {

  const onInicioDataBlur = (e) => {
    setFimDataValue(e.target.value);
  };

  const [fimDataInput, fimDataValue, setFimDataValue] = useInput("Data (DD/MM/AAAA)");
  const [fimHorarioInput, fimHorarioValue, setFimHorarioValue] = useInput("Hora (HH:MM)");
  const [fimPaginaInput, fimPaginaValue, setFimPaginaValue] = useInput("Página em que parei");

  const [inicioDataInput, inicioDataValue, setInicioDataValue] = useInput("Data (DD/MM/AAAA)", onInicioDataBlur);
  const [inicioHorarioInput, inicioHorarioValue, setInicioHorarioValue] = useInput("Hora (HH:MM)");
  const [jaPareiCheckbox, jaPareiValue, setJaPareiValue] = useCheckbox("Fim retroativo", false, [setFimDataValue, setFimHorarioValue, setFimPaginaValue])

  const [livroInput, livroValue, setLivroValue] = useInput("Livro que vou ler agora");
  const [inicioPaginaInput, inicioPaginaValue, setInicioPaginaValue] = useInput("Página em que vou começar");
  const [jaComeceiCheckbox, jaComeceiValue, setJaComeceiValue] = useCheckbox("Início retroativo", false, [setInicioDataValue, setInicioHorarioValue, setJaPareiValue])

  useEffect(() => {
    setLivroValue(currentBook);
  }, [setLivroValue, currentBook]);

  const handleSubmit = (e) => {
    const entry = {
      book_id: livroValue,
      start_time: TimeRFC3339(jaComeceiValue, true, inicioDataValue, inicioHorarioValue),
      end_time: TimeRFC3339(jaPareiValue, false, fimDataValue, fimHorarioValue),
      start_location: parseInt(inicioPaginaValue, 10) || null,
      end_location: parseInt(fimPaginaValue, 10) || null
    }
    addEntry(token, entry, data, dispatch);

    !currentBook && setLivroValue("");
    setInicioDataValue("");
    setInicioHorarioValue("");
    setInicioPaginaValue("");
    setFimDataValue("");
    setFimHorarioValue("");
    setFimPaginaValue("");
    setJaComeceiValue(false);
    setJaPareiValue(false);

    e.preventDefault();
  };

  return (
    <rs.Form onSubmit={handleSubmit}>

      <rs.Card>
        <rs.CardBody>

          <rs.Row>
            <rs.Col sm={4}>
                {livroInput}
            </rs.Col>

            {!jaComeceiValue && <rs.Col sm={4}>
              {inicioPaginaInput}
            </rs.Col>}

            <rs.Col sm={2}>
              {jaComeceiCheckbox}
            </rs.Col>

            <rs.Col sm={2}>
              {!jaComeceiValue && <rs.Button color="dark">Começar</rs.Button>}
            </rs.Col>

          </rs.Row>


          {jaComeceiValue && (
            <>
          <rs.Badge color="warning">Início retroativo</rs.Badge>

          <rs.Row>
            <rs.Col sm={3}>
              {inicioDataInput}
            </rs.Col>
            <rs.Col sm={3}>
              {inicioHorarioInput}
            </rs.Col>
            <rs.Col sm={3}>
              {inicioPaginaInput}
            </rs.Col>
            <rs.Col sm={2}>
              {jaPareiCheckbox}
            </rs.Col>
            </rs.Row>
            </>

            )}

          {jaPareiValue && (
            <>
          <rs.Badge color="warning">Fim retroativo</rs.Badge>
          <rs.Row>
            <rs.Col sm={3}>
              {fimDataInput}
            </rs.Col>
            <rs.Col sm={3}>
              {fimHorarioInput}
            </rs.Col>
            <rs.Col sm={3}>
              {fimPaginaInput}
            </rs.Col>
          </rs.Row>
            </>
          )}

          {jaComeceiValue && <rs.Button color="dark">Adicionar registro</rs.Button>}

        </rs.CardBody>
      </rs.Card>

    </rs.Form>
  )
}

const dateAndTimeToDate = (data, hora) => {
  var data_parts = data.split("/");
  var hora_parts = hora.split(":");
  var dt = new Date(
    parseInt(data_parts[2], 10), // ano
    parseInt(data_parts[1], 10) - 1, // mês começa com 0
    parseInt(data_parts[0], 10), // dia
    parseInt(hora_parts[0], 10), // hora
    parseInt(hora_parts[1], 10), // minuto
  );
  return dt
}

const TimeRFC3339 = (usarHorarioManual, retornarAgora, data, hora) => {
  if (usarHorarioManual) {
    try {
      return dateAndTimeToDate(data, hora).toISOString();
    } catch (e) {
      return ""
    }
  }
  if (retornarAgora) {
    return new Date().toISOString();
  }
  return ""
};
