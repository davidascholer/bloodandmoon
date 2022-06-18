import { useEffect, useState } from 'react';

export default function useLoggerState() {
    const [value, setValue] = useState()

    useEffect(() => {
        console.log("logger state: "+value);
    }, [value])

    return [value, setValue];
}
