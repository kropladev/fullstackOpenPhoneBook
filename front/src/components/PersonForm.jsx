const PersonForm = ({savePerson, newName, newPhone, handlePersonNameChange , handlePersonPhoneChange}) => {

    return (
        <>
            <form onSubmit={savePerson}>
                <div>
                    name: <input onChange={handlePersonNameChange} value={newName}/>
                </div>
                <div>number: <input onChange={handlePersonPhoneChange} value={newPhone}/></div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </>
    )
}

export default PersonForm