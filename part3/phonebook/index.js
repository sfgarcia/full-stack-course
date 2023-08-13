require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Phonebook = require('./models/phonebook')

app.use(express.json())
morgan.token('request', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['request'](req, res)
    ].join(' ')
  }
)
)

app.post('/api/persons', (request, response) => {
  const body = request.body
  const person = new Phonebook({
    name: body.name,
    number: body.number,
  })

  if (!person.name || !person.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  
  Phonebook.find({name: person.name}).then(returnedPerson => {
    if(returnedPerson.length > 0) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === Number(id))
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `
  )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})