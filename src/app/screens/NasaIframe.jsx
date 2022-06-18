import React, { useEffect, useState} from 'react';

export default function NasaIframe() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const setWindowDims = () => {
        setWindowHeight(window.innerHeight);
        setWindowWidth(window.innerWidth);
    }

    useEffect(()=>{
        setWindowDims();
    },[])

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowDims();
        });
        return () => {
            window.removeEventListener("resize", () => {
                setWindowDims();
            })
        }
    }, []);
      
    return(
        <iframe title="nasa-moon" src="https://solarsystem.nasa.gov/__webgl/5/moon_lunar/" height={windowHeight} width={windowWidth}/>
    );
}