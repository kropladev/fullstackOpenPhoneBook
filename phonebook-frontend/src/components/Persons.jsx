const Persons = ({filter, persons, handleDelete}) => {

    const deletePerson = (person) => {
        if(confirm(`Delete data: ${person.name} [${person.number}] with id ${person.id}?`)){
            handleDelete(person.id)
        }
    }

    return (
        <>
            {
                persons
                    .filter(p =>
                        p.name.toLowerCase().includes(filter.toLowerCase())
                    )
                    .map(p =>
                        <div key={p.name}>
                            {p.name} {p.number || ""}
                            <button onClick={() => deletePerson(p)}>delete</button>
                        </div>
                    )
            }
        </>
    )
}
export default Persons