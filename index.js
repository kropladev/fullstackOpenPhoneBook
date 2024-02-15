const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
//app.use(morgan('tiny'))
app.use(cors())

morgan.token('postBody', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(p => p.id === Number(request.params.id))
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const person = persons.find(p => p.id === Number(request.params.id))

    persons = persons.filter(p => p.id !== Number(request.params.id))

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    console.log(body)
    if (!body || !body.name || !body.number) {
        return response.status(400).json({
            error: 'Person name or number missing'
        })
    }

    if(persons.some(p => p.name === body.name)){
        return response.status(400).json({
            error: 'New person name must be unique'
        })
    }

    const newPerson = {
        ...body,
        id: generateId()
    }
    console.log(newPerson)

    persons = persons.concat(newPerson)
    response.status(201).send(newPerson)
})

app.get('/info', (request, response) => {
    const infoBody = `Phonebook has info for ${persons.length} people <br/> ${new Date().toString()}`

    response.send(infoBody)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const generateId = () => {
    const min = Math.max(...persons.map(n => n.id)) + 1
    return Math.floor(Math.random() * (min + 3) + min)
}


//Middleware:

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
//app.use(requestLogger)


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


