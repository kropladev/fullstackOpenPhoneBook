const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://makroplewski:${password}@cluster0.lcdqacc.mongodb.net/phoneApp?retryWrites=true&w=majority`
    //`mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)


/*
const person = new Person({
    name: 'John Doe',
    number: '888-888-888',
})*/
if(newName && newNumber) {
    const person = new Person({
        name: newName,
        number: newNumber,
    })

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
} else {

    mongoose.connect(url)
    Person.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}
