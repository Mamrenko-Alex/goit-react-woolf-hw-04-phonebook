import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import styles from './PhoneBook.module.css';
import { ContactForm } from './ContactForm';
import { ContactList } from './ContactList';
import { SearchFilter } from './SearchFilter';
import { Notification } from './Notification/Notification';

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const savedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (savedContacts) {
      setContacts(savedContacts);
      setContactsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (contactsLoaded) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }, [contacts, contactsLoaded]);

  const handleChange = event => {
    const { value } = event.target;
    setFilter(value);
  };

  const addContact = (name, number) => {
    const newContact = {
      id: nanoid(),
      name,
      number,
    };
    if (
      contacts.find(
        ({ name }) =>
          name.toLocaleLowerCase() === newContact.name.toLocaleLowerCase()
      )
    ) {
      alert(`${newContact.name} is already in contacts`);
      return;
    }
    setContacts(prevContacts => [...prevContacts, newContact]);
    setFilter('');
  };

  const deleteContact = deleteId => {
    setContacts(prevContacts =>
      prevContacts.filter(({ id }) => id !== deleteId)
    );
  };

  const filteredContacts = contacts.filter(({ name }) =>
    name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.hero}>Phonebook</h1>
      <ContactForm addContact={addContact} />
      <h2 className={styles.title}>Contacts</h2>
      <SearchFilter value={filter} onChange={handleChange} />
      {!contacts.length ? (
        <Notification message="You don't have any contacts yet"></Notification>
      ) : (
        <ContactList
          contacts={filteredContacts}
          onDeleteContact={deleteContact}
        />
      )}
    </div>
  );
};
