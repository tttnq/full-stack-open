import React, { useState, useEffect } from "react";
import personService from "./services/persons";

const Filter = ({ onChange }) => {
  return (
    <div>
      filter shown with <input onChange={onChange} />
    </div>
  );
};

const PersonForm = (props) => {
  const {
    onSubmit,
    handleNameChange,
    handleNumberChange,
    nameValue,
    numberValue,
  } = props;

  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input onChange={handleNameChange} value={nameValue} />
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={numberValue} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ namesToShow, deletePerson }) => {
  return (
    <ul>
      {namesToShow.map((p) => (
        <li key={p.id}>
          {p.name} {p.number} <button onClick={() => deletePerson(p.id)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

const Notification = ({ message, errorStatus }) => {
  if (message === null) {
    return null;
  }

  const errorStyle = {
    color: errorStatus ? "red" : "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={errorStyle}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    error: null,
  });

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((initialPersons) => {
      console.log("promise fulfilled");
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personFound = persons.find((p) => p.name === newName);
    if (personFound) {
      if (window.confirm( `${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...personFound, number: newNum };
        personService
          .update(updatedPerson.id, updatedPerson)
          .then((returnedPerson) => {
            console.log(returnedPerson);
            setPersons(
              persons.map((p) =>
                p.id !== updatedPerson.id ? p : returnedPerson
              )
            );
            setNotification({
              message: `Updated ${updatedPerson.name}'s phone number`,
              error: false,
            });
            setTimeout(() => {
              setNotification({ message: null, error: false });
            }, 5000);
          })
          .catch((error) => {
            console.log(error);
            setPersons(persons.filter((p) => p.id !== updatedPerson.id));
            setNotification({
              message: `Information of ${updatedPerson.name} has already been removed from server`,
              error: true,
            });
            setTimeout(() => {
              setNotification({ message: null, error: false });
            }, 5000);
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNum,
      };
      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        console.log(returnedPerson);
        setNotification({ message: `Added ${newPerson.name}`, error: false });
        setTimeout(() => {
          setNotification({ message: null, error: false });
        }, 5000);
      });
    }

    setNewName("");
    setNewNum("");
  };

  const deletePerson = (id) => {
    console.log("button clicked and id was:", id);
    const person = persons.find((p) => p.id === id);

    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.remove(person.id).then(() => {
        setPersons(persons.filter((p) => p.id !== person.id));
        setNotification({ message: `Deleted ${person.name}`, error: false });
        setTimeout(() => {
          setNotification({ message: null, error: true });
        }, 5000);
      });
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNum(event.target.value);
  };

  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setFilterValue(event.target.value);
  };

  const namesToShow =
    filterValue.length === 0
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(filterValue.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification.message}
        errorStatus={notification.error}
      />
      <Filter onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        nameValue={newName}
        numberValue={newNum}
      />
      <h2>Numbers</h2>
      <Persons namesToShow={namesToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
