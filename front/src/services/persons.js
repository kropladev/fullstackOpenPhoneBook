import axios from "axios";

const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
    return axios
        .get(baseUrl).then(result => result.data)
}

const create = (person) => {
    return axios
        .post(baseUrl, person).then(result => result.data)
}

const remove = (id) => {
    return axios
        .delete(baseUrl.concat('/', id)).then(result => result.data)
}

const update = (id, person) => {
    return axios
        .put(baseUrl.concat('/', id), person).then(result => result.data)
}


export default {
    getAll,
    create,
    remove,
    update

}
