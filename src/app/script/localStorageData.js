const set = data => {
    // To store data
    localStorage.setItem('data', JSON.stringify(data));
}

const get = () => {
    // To retrieve data
    return JSON.parse(localStorage.getItem('data'));
}

const remove = () => {
    // To clear a specific item
    localStorage.removeItem('data');
}

const clear = () => {
    // To clear the whole data stored in localStorage
    localStorage.clear();
}


export default {
    set,
    get,
    remove,
    clear
}