import { useEffect, useState } from 'react';

//gets the saved value from the local storage
//returns the saved value if it exists or the initial value if not
function getSavedValue(key, initialValue) {
    console.log("getSavedValue");
    const savedValue = JSON.parse(localStorage.getItem(key));
    if (savedValue) return savedValue;

    //checks if the initial value is a function or not before returning it.
    if (initialValue instanceof Function) return initialValue();
    return initialValue;
}

export default function useStorageState(key, initialValue) {
    const [value, setValue] = useState(() => {
        return getSavedValue(key, initialValue)
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
        console.log("saved");
    }, [value])

    return [value, setValue];
}
