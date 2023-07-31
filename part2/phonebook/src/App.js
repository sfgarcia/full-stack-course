import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <form>
        <div>filter shown with <input value={filter} onChange={handleFilterChange}/></div>
    </form>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
        <div>name: <input value={props.newName} onChange={props.handleNameChange}/> </div>
        <div>number: <input value={props.newPhone} onChange={props.handlePhoneChange}/> </div>
        <button type="submit">add</button>
    </form>
  )
}

const Persons = (props) => {
  return (
    <div>
      {props.persons.map(person =>
        <p key={person.id}>{person.name} {person.number}
        <button id={person.id} type="submit" onClick={() => props.deletePerson(person.id)}>delete</button>
        </p>
      )}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='message'>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const personsToShow = filter.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newPhone,
    }
    if(newName === '' || newPhone === '') return
    const msg = `${newName} is already added to phonebook, replace the old number with a new one?`
    const new_person = persons.find(person => person.name === newName)
    if(new_person != null) {
      if(window.confirm(msg)) {
        personService
          .update(new_person.id, nameObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== new_person.id ? person : returnedPerson))
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${newName} has already been removed from the server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    }
    else{
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setMessage(
            `Added ${returnedPerson.name}`
          )
          setTimeout(() => {setMessage(null)}, 5000)
        })
    }
  }

  const deletePerson = (person_id) => {
    const person = persons.find(person => person.id === person_id)
    if(window.confirm(`Delete ${person.name}?`)) {
      personService
        .del(person_id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== person_id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Error message={errorMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newPhone={newPhone}
        handlePhoneChange={handlePhoneChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
