const Filter = ({filter, handleFilterPersons}) => {
    return (
        <div>
            Filter shown with <input value={filter} onChange={handleFilterPersons}/>
        </div>
    )
}

export default Filter
