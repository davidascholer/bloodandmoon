import React, { useContext, useEffect, useState } from 'react';

import moon from '../images/moon.png';

//CSS
import '../styles/moon.css';

export default function Moon({cyclePercentage, width}) {

    useEffect(() => {
        /*
        Phases:
            waxing-gibbous - shadow from left side of moon to middle
            waxing-crescent - shadow from middle to right side of moon
            waning-gibbous - shadow from right side of moon to middle
            waning-crescent - shadow from middle to left side of moon
        */
        transform(cyclePercentage, width);
    }, [])

    const transform = (cyclePercentage, width) => {

        if (cyclePercentage > 100)
            return console.error("image transform out of bounds");

        const moonContainer = document.querySelector('.moon-container');
        const moon = document.querySelector('.moon');
        const moonLeftContainer = document.querySelector('.moon-left-container');
        const moonRightContainer = document.querySelector('.moon-right-container');
        const moonLeft = document.querySelector('.moon-left');
        const moonRight = document.querySelector('.moon-right');
        const moonBlurGradient = document.querySelector('.moon-blur-gradient');

        moonContainer.style.setProperty('--container-width', `${width}px`);
        moon.style.visibility = 'visible';

        if (cyclePercentage < 25) {

            //Waxing Crescent
            moonLeft.style.visibility = 'hidden';
            moonLeftContainer.style.backgroundColor = 'black';
            moonRight.style.visibility = 'hidden';
            moonRightContainer.style.backgroundColor = 'none';
            moonContainer.style.setProperty('--umbra-background', `black`);
            moonContainer.style.setProperty('--umbra-shadow-background', `none`);

            const relativeCyclePercentage = 25 - cyclePercentage;
            const phasePercentage = relativeCyclePercentage * 4;
            console.log("phasePerc: "+phasePercentage);
            /* Left + half width should be 50 */
            const shadowLeft = 50 - phasePercentage / 2;
            moonContainer.style.setProperty('--umbra-shadow-left', `${shadowLeft}%`);
            moonContainer.style.setProperty('--umbra-shadow-width', `${phasePercentage}%`);

            const gradientFormula = 1-phasePercentage*.01;
            moonBlurGradient.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, ${gradientFormula}), rgba(0, 0, 0, ${gradientFormula*.95}),rgba(0,0,0,0))`;

        } else if (cyclePercentage < 50) {

            //Waxing Gibbous
            moonLeft.style.visibility = 'hidden';
            moonLeftContainer.style.backgroundColor = 'none';
            moonRight.style.visibility = 'visible';
            moonRightContainer.style.backgroundColor = 'none';
            moonContainer.style.setProperty('--umbra-background', `none`);
            moonContainer.style.setProperty('--umbra-shadow-background', `black`);

            const relativeCyclePercentage = cyclePercentage - 25;
            const phasePercentage = relativeCyclePercentage * 4;
            /* Left + half width should be 50 */
            const shadowLeft = 50 - phasePercentage / 2;
            moonContainer.style.setProperty('--umbra-shadow-left', `${shadowLeft}%`);
            moonContainer.style.setProperty('--umbra-shadow-width', `${phasePercentage}%`);

            const gradientFormula = 1-phasePercentage*.01;
            moonBlurGradient.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, ${gradientFormula}), rgba(0, 0, 0, ${gradientFormula*.95}),rgba(0,0,0,0))`;

        } else if (cyclePercentage < 75) {

            //Waning Gibbous
            moonLeft.style.visibility = 'visible';
            moonLeftContainer.style.backgroundColor = 'none';
            moonRight.style.visibility = 'hidden';
            moonRightContainer.style.backgroundColor = 'none';
            moonContainer.style.setProperty('--umbra-background', `none`);
            moonContainer.style.setProperty('--umbra-shadow-background', `black`);

            const relativeCyclePercentage = cyclePercentage - 50;
            const phasePercentage = (25 - relativeCyclePercentage) * 4;
            /* Left + half width should be 50 */
            const shadowLeft = 50 - phasePercentage / 2;
            moonContainer.style.setProperty('--umbra-shadow-left', `${shadowLeft}%`);
            moonContainer.style.setProperty('--umbra-shadow-width', `${phasePercentage}%`);

            const gradientFormula = 1-phasePercentage*.01;
            moonBlurGradient.style.backgroundImage = `linear-gradient(to left, rgba(0, 0, 0, ${gradientFormula}), rgba(0, 0, 0, ${gradientFormula*.95}),rgba(0,0,0,0))`;

        } else if (cyclePercentage < 100) {

            //Waning Crescent
            moonLeft.style.visibility = 'hidden';
            moonLeftContainer.style.backgroundColor = 'none';
            moonRight.style.visibility = 'hidden';
            moonRightContainer.style.backgroundColor = 'black';
            moonContainer.style.setProperty('--umbra-background', `black`);
            moonContainer.style.setProperty('--umbra-shadow-background', `none`);

            const relativeCyclePercentage = cyclePercentage - 75;
            const phasePercentage = relativeCyclePercentage * 4;
            /* Left + half width should be 50 */
            const shadowLeft = 50 - phasePercentage / 2;
            moonContainer.style.setProperty('--umbra-shadow-left', `${shadowLeft}%`);
            moonContainer.style.setProperty('--umbra-shadow-width', `${phasePercentage}%`);

            const gradientFormula = 1-phasePercentage*.01;
            moonBlurGradient.style.backgroundImage = `linear-gradient(to left, rgba(0, 0, 0, ${gradientFormula}), rgba(0, 0, 0, ${gradientFormula*.95}),rgba(0,0,0,0))`;

        } else{
            
            //no moon
            moonLeft.style.visibility = 'hidden';
            moonLeftContainer.style.backgroundColor = 'none';
            moonRight.style.visibility = 'hidden';
            moonRightContainer.style.backgroundColor = 'none';
            moonContainer.style.setProperty('--umbra-background', `none`);
            moonContainer.style.setProperty('--umbra-shadow-background', `none`);

            moonBlurGradient.style.backgroundImage = `linear-gradient(to left, rgba(0, 0, 0, .93), rgba(0, 0, 0, .93))`;
        }
    }

    return (
        <div className='moon-container'>
            <img src={moon} className='moon'></img>
            <div className="umbra"></div>
            <div className='moon-left-container'><img src={moon} className='moon-left'></img></div>
            <div className='moon-right-container'><img src={moon} className='moon-right'></img></div>
            <div className='moon-blur-gradient'></div>

        </div>
    );
}
