import {useEffect, useState} from 'react'
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Persons from "./components/Persons.jsx";
import PersonsService from "./services/persons.js";
import Notification from "./components/Notification.jsx";
import './index.css'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [filter, setFilter] = useState('')
    const [infoMessage, setInfoMessage] = useState('')
    const [notificationType, setNotificationType] = useState('')

    useEffect(() => {
        PersonsService.getAll().then(persons => {
            setPersons(persons)
        })
    }, []);


    const savePerson = (event) => {
        event.preventDefault()
        console.log('button clicked', event.target)
        if (!persons.some(p => p.name === newName)) {
            /* setPersons(
                 [...persons, {name: newName, number: newPhone}]
             )*/
            PersonsService.create({
                name: newName,
                number: newPhone
            })
                .then(newPerson => setPersons(persons.concat(newPerson)))
                .then(() => {
                    setInfoMessage(`Added '${newName}' to db`)
                    setNotificationType('info')

                    setTimeout(() => {
                        setInfoMessage(null)
                    }, 5000)

                })
                .then(() => {
                    setNewName("")
                    setNewPhone("")
                }).catch(error => {
                    setInfoMessage(`${error.response.data.error}`)
                    setNotificationType('error')

                    setTimeout(() => {
                        setInfoMessage(null)
                    }, 5000)
            })


        } else if (persons.some(p => p.name === newName && p.number !== newPhone)) {
            const personForUpdate = persons.find(p => p.name === newName);
            if (confirm(`${personForUpdate.name} is already added to phonebook, replace the old number [${personForUpdate.number}] with a new one [${newPhone}]?`)) {
                const newPerson = {...personForUpdate, number: newPhone}
                PersonsService
                    .update(newPerson.id, {...newPerson})
                    .then(data => setPersons(persons.map(p => p.id !== personForUpdate.id ? p : data)))
                    .catch(() => {
                        setInfoMessage(
                            `Information of '${newPerson.name}' has already been removed from server`
                        )
                        setNotificationType('error')

                        setTimeout(() => {
                            setInfoMessage(null)
                        }, 5000)
                    })
                setNewName('')
                setNewPhone('')
                setPersons(persons.filter(p => p.id !== newPerson.id))
            }

        } else {
            alert(`${newName} is already added to phonebook`)
        }
    }

    const handlePersonNameChange = (event) => {
        setNewName(event.target.value)
    }
    const handlePersonPhoneChange = (event) => {
        setNewPhone(event.target.value)
    }
    const handleFilterPersons = (event) => {
        setFilter(event.target.value)
    }
    const handleDelete = (id) => {
        console.log(`handle delete: ${id}`)
        PersonsService.remove(id).then(data => {
                console.log(id, JSON.stringify(data))
                setPersons(persons.filter(p => p.id !== id))
            }
        );
    }


    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={infoMessage} type={notificationType}/>
            <Filter filter={filter} handleFilterPersons={handleFilterPersons}/>
            <h3>add new</h3>
            <PersonForm savePerson={savePerson} handlePersonNameChange={handlePersonNameChange}
                        handlePersonPhoneChange={handlePersonPhoneChange} newName={newName}
                        newPhone={newPhone}/>
            <h2>Numbers</h2>
            <Persons persons={persons} filter={filter} handleDelete={handleDelete}/>
        </div>
    )
}

export default App