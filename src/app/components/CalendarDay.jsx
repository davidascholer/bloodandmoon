import React, { useContext, useEffect, useState } from 'react';

//Images
import wolfHappy from '../images/wolves/wolf_happy.png';
import wolfLove from '../images/wolves/wolf_love.png';
import wolfOuch from '../images/wolves/wolf_ouch.png';
import wolfAngry from '../images/wolves/wolf_angry.png';
import wolfSad from '../images/wolves/wolf_sad.png';
import wolfSleepy from '../images/wolves/wolf_sleepy.png';
import wolfStressed from '../images/wolves/wolf_stressed.png';
import noteIcon from '../images/notes_light.png';

const emojiIcons = { 'sad': wolfSad, 'sleepy': wolfSleepy, 'happy': wolfHappy, 'love': wolfLove, 'ouch': wolfOuch, 'angry': wolfAngry, 'stressed': wolfStressed, 'notes': noteIcon };

export default function CalendarDay({ date, dayData, fromYear, calDayKey, data, icons, handleDayClicked, contentDisplay }) {
    const [iconSet, setIconSet] = useState([]);
    const [blood, setBlood] = useState(false);

    useEffect(() => {

        if (data)
            if (data[date.year])
                if (data[date.year][date.month])
                    if (data[date.year][date.month][dayData.dayNumber]) {

                        let newIconSet = [];

                        if (data[date.year][date.month][dayData.dayNumber].blood) {
                            setBlood(data[date.year][date.month][dayData.dayNumber].blood);
                        } else {
                            setBlood(false);
                        }

                        const emojis = data[date.year][date.month][dayData.dayNumber].emojis;
                        if (emojis)
                            newIconSet = emojis;

                        const notes = data[date.year][date.month][dayData.dayNumber].notes;
                        if (notes && notes.length > 0 && !newIconSet.includes('notes'))
                            newIconSet.push('notes');

                        setIconSet(newIconSet);
                    }
    }, [])


    const getMoonLinkForDay = day => {
        const hoursInDay = 24;
        const now = new Date(date.year, date.month, day);
        const start = new Date(date.year, 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const hourOfYear = dayOfYear * hoursInDay;
        const formattedHour = ('0000' + hourOfYear).slice(-4);

        //0001 = jan 1 hour 12am, 8760 = dec 31 11pm
        //To get the links, google: nasa moon phases + year exp. nasa moon phases 2014
        const year2014Link = `https://svs.gsfc.nasa.gov/vis/a000000/a004100/a004118/frames/216x216_1x1_30p/moon.${formattedHour}.jpg`;
        const year2015Link = `https://svs.gsfc.nasa.gov/vis/a000000/a004200/a004236/frames/216x216_1x1_30p/moon.${formattedHour}.jpg`;
        const year2016Link = `https://svs.gsfc.nasa.gov/vis/a000000/a004400/a004404/frames/216x216_1x1_30p/moon.${formattedHour}.jpg`;
        const year2017Link = `https://svs.gsfc.nasa.gov/vis/a000000/a004500/a004537/frames/216x216_1x1_30p/moon.${formattedHour}.jpg`;
        const year2018Link = `https://svs.gsfc.nasa.gov/vis/a000000/a004600/a004604/frames/216x216_1x1_30p/moon.${formattedHour}.jpg`;
        const year2019Link = `https://svs.gsfc.nasa.gov/vis/a000000/a004400/a004442/frames/216x216_1x1_30p/moon.${formattedHour}.jpg`;
        const year2020Link = `https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004768/frames/216x216_1x1_30p/moon.${formattedHour}.jpg`;
        const year2021Link = `https://svs.gsfc.nasa.gov/vis/a000000/a004800/a004874/frames/216x216_1x1_30p/moon.${formattedHour}.jpg`;
        const year2022Link = `https://svs.gsfc.nasa.gov/vis/a000000/a004900/a004955/frames/216x216_1x1_30p/moon.${formattedHour}.jpg`;

        if (date.year === 2022)
            return year2022Link;
        else if (date.year === 2021)
            return year2021Link;
        else if (date.year === 2020)
            return year2020Link;
        else if (date.year === 2019)
            return year2019Link;
        else if (date.year === 2018)
            return year2018Link;
        else if (date.year === 2017)
            return year2017Link;
        else if (date.year === 2016)
            return year2016Link;
        else if (date.year === 2015)
            return year2015Link;
        else if (date.year === 2014)
            return year2014Link;
        else
            return null;
    }

    return (
        <>
            {dayData.inCurrentMonth &&
                <div key={calDayKey} className={(blood && dayData.inCurrentMonth) ? 'day-container pointer blood' : 'day-container pointer'} onClick={() => handleDayClicked(dayData)}>
                    {!fromYear &&
                        <div className='day-date-moon'>
                            <span className={dayData.inCurrentMonth ? 'in-current-month' : 'not-in-current-month'}>{dayData.dayNumber}</span>
                            <img src={getMoonLinkForDay(dayData.dayNumber)} className={blood ? 'framed' : ''} style={{ display: contentDisplay }} />
                        </div>
                    }
                    {fromYear &&
                        <div className='day-date-moon'>
                            <span className={dayData.inCurrentMonth ? 'in-current-month' : 'not-in-current-month'}>{dayData.dayNumber}</span>
                            {getMoonLinkForDay(dayData.dayNumber) == null &&
                                <span className={dayData.inCurrentMonth ? 'in-current-month' : 'not-in-current-month'}>{dayData.dayNumber}</span>
                            }
                        </div>
                    }
                    <div className='day-icons'>
                        {iconSet.map((icon, iconKey) => <img key={iconKey} src={emojiIcons[icon]} style={{ display: contentDisplay }} />)}
                    </div>
                </div>
            }
            {!dayData.inCurrentMonth &&
                <div key={calDayKey} className={(blood && dayData.inCurrentMonth) ? 'day-container blood' : 'day-container'}>
                    <div className='day-date-moon'>
                        <span>&nbsp;</span>
                        <img src={getMoonLinkForDay(dayData.dayNumber)} />
                    </div>
                </div>
            }
        </>
    );
}
