import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')

  const personsToShow = filter.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newPhone,
      id: persons.length + 1
    }
    if(newName === '' || newPhone === '') return
    if(persons.find(person => person.name === newName) != null) {
      alert(`${newName} is already added to phonebook`)
    }
    else{
      setPersons(persons.concat(nameObject))
      setNewName('')
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
      <form>
        <div>filter shown with <input value={filter} onChange={handleFilterChange}/></div>
      </form>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleNameChange}/> </div>
        <div>number: <input value={newPhone} onChange={handlePhoneChange}/> </div>
        <button type="submit">add</button>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map(person => <p key={person.id}>{person.name} {person.number}</p>)}
    </div>
  )
}

export default App
