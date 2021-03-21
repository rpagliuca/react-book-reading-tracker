import { useState } from 'react';
import * as rs from 'reactstrap';
import { filterByBook, connectWithBookTitles } from './../model/actions.js';

const ALL_BOOKS = "Todos os livros";

function Filter({bookTitles, dispatch}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [title, setTitle] = useState(ALL_BOOKS);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const filter = (label, id) => {
    setTitle(label);
    filterByBook(dispatch, id);
  }

  return (
    <rs.Form>
    <rs.Row>
      <rs.Col>
    <rs.Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <rs.DropdownToggle caret>
        {title}
      </rs.DropdownToggle>
      <rs.DropdownMenu>
        <rs.DropdownItem onClick={() => filter(ALL_BOOKS, null)}>{ALL_BOOKS}</rs.DropdownItem>
        {bookTitles && bookTitles.length && bookTitles.map(i => (
          <rs.DropdownItem key={i} onClick={() => filter(i, i)}>{i}</rs.DropdownItem>
        ))}
      </rs.DropdownMenu>
    </rs.Dropdown>
  </rs.Col>
  </rs.Row>
    </rs.Form>
  );
}

export const ConnectedFilter = connectWithBookTitles(Filter);
