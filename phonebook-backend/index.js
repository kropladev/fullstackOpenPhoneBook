require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
//app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const Person = require('./models/person')


morgan.token('postBody', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    }).catch(error => next(error))

})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  console.log(body)
  if (!body || !body.name || !body.number) {
    return response.status(400).json({
      error: 'Person name or number missing'
    })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })
  console.log(newPerson)

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(c => {
    const infoBody = `Phonebook has info for ${c} people <br/> ${new Date().toString()}`
    response.send(infoBody)
  })
})


/*const generateId = () => {
  const min = Math.max(...persons.map(n => n.id)) + 1
  return Math.floor(Math.random() * (min + 3) + min)
}*/


//Middleware:

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
