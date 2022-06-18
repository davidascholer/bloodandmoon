/*
MAIN SCREEN
When a user logs in, they will be directed to this screen.
*/
import React, { useEffect, useState } from 'react';

import DayOptions from '../components/DayOptions';
import CalendarDay from '../components/CalendarDay';
// import Moon from '../components/Moon';

//Styles
import '../styles/calendar_screen_styles.css';
//Script
import dateFormatter from '../script/dateFormatter';
import localStorageData from '../script/localStorageData';
import useStorageState from '../hooks/useStorageState';
//Images
import calendarIcon from '../images/calendar_light.png';
import leftArrow from '../images/arrow_left_light.png';
import rightArrow from '../images/arrow_right_light.png';
import leftArrowLight from '../images/arrow_left_light.png';
import rightArrowLight from '../images/arrow_right_light.png';

export default function CalendarScreen() {

    const [dataObject, setDataObject] = useState(getInitialDayData());

    const [dayData, setDayData] = useState({});
    const [update, setUpdate] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(null);
    const [currentYear, setCurrentYear] = useState(null);
    const [yearCalendarShown, setYearCalendarShown] = useState(false);
    const [dayContentDisplay, setDayContentDisplay] = useState('inline-block');

    // Get data from the local storage.
    function getInitialDayData() {
        const returnData = localStorageData.get();
        if (returnData)
            return returnData;

        return {};
    };

    // Set the current month and year.
    useEffect(() => {
        const date = new Date(Date.now());
        const year = date.getFullYear();
        const month = date.getMonth();
        setCurrentYear(year);
        setCurrentMonth(month);
    }, []);

    // Updates the calendar data.
    useEffect(() => {
        if (currentYear && currentMonth)
            getMonthData(currentYear, currentMonth);
    }, [currentMonth, currentYear]);

    const updateUI = () => {
        setUpdate(!update)
    }

    // Organizes the month data into calendar form.
    const getMonthData = (year, month) => {
        const {
            firstSunday,
            daysInPreviousMonth,
            daysInCurrentMonth,
            lastSaturday
        } = dateFormatter.getDaysInCurrentCalendar(year, month);

        //If the first Sunday isn't on the 1st, get the extra days to add to the beginning of the calendar.
        const prependDays = (firstSunday === 1) ? 0 : daysInPreviousMonth - firstSunday + 1;
        //If the last Saturday isn't on the last day of the month, get the extra days to add to the end of the calendar.
        const appendDays = (lastSaturday === daysInCurrentMonth) ? 0 : lastSaturday;
        //Get the total number of days on the calendar
        const totalDays = prependDays + daysInCurrentMonth + appendDays;
        //Should be a factor of 7. Check just in case.
        if (totalDays % 7 !== 0) {
            console.error(`Error propagating calendar data. Number of days is ${totalDays}.`);
        }

        let days = [];
        let weeks = [];
        let day = firstSunday;
        let inCurrentMonth = (firstSunday === 1);//false if the 1st does not fall on a Sunday
        for (let i = 0; i < totalDays; i++) {
            if (day > daysInPreviousMonth && i < totalDays / 2) {
                day = 1;
                inCurrentMonth = true;
            }
            if (day > daysInCurrentMonth && i > totalDays / 2) {
                day = 1;
                inCurrentMonth = false;
            }

            days.push({ dayNumber: day, inCurrentMonth: inCurrentMonth });
            day++;

            if ((i + 1) % 7 === 0) {
                weeks.push(days);
                days = [];
            }
        }

        return weeks
    }

    // Move all UI data to the next month.
    const handleNextMonthClicked = () => {
        const { newYear, newMonth } = dateFormatter.increaseMonth(currentYear, currentMonth);
        if (currentYear !== newYear)
            setCurrentYear(newYear);

        setCurrentMonth(newMonth);
    }

    // Move all UI data to the previous month.
    const handlePrevMonthClicked = () => {
        const { newYear, newMonth } = dateFormatter.decreaseMonth(currentYear, currentMonth);
        if (currentYear !== newYear)
            setCurrentYear(newYear);

        setCurrentMonth(newMonth);
    }

    // Opens the day dialogue of the UI.
    const handleDayClicked = dayData => {
        if (!yearCalendarShown) {
            setDayData(dayData);
        }
        showDayContents();
    }

    // Saves the updated day information.
    const saveOnClose = (dayObject, y, m, d) => {
        saveDataObject(dayObject, y, m, d);
    }

    // Open the dialogue for the year overlay.
    const handleOpenYearOverlay = () => {
        setYearCalendarShown(true);
    }

    // Close the dialogue for the year overlay.
    const handleCloseYearOverlay = () => {
        setYearCalendarShown(false);
    }

    // Move all UI data to the previous year (in year dialogue).
    const handlePrevYearClicked = () => {
        setCurrentYear(currentYear - 1);
    }

    // Move all UI data to the next year (in year dialogue).
    const handleNextYearClicked = () => {
        setCurrentYear(currentYear + 1);
    }

    // Sets the main UI to the year of the month of the date clicked.
    const handleMonthClicked = (month) => {
        setCurrentMonth(month);
        handleCloseYearOverlay();
    }

    // Sets the current UI and saves to storage.
    const saveDataObject = (dayObject, y, m, d) => {
        const tempDataObject = dataObject;
        if (!tempDataObject[y])
            tempDataObject[y] = {};
        if (!tempDataObject[y][m])
            tempDataObject[y][m] = {};
        if (!tempDataObject[y][m][d])
            tempDataObject[y][m][d] = {};

        tempDataObject[y][m][d] = dayObject;
        setDataObject(tempDataObject);
        localStorageData.set(tempDataObject);
    }

    // Closes the day options. 
    const handleDayArrowClicked = () => {
        hideDayContents();
    }

    // Animtes the hiding of the day options.
    const hideDayContents = () => {
        const cal = document.querySelector('.calendar .month-container');
        cal.classList.remove('shrink-calendar');
        cal.classList.add('grow-calendar');
        const dayOptionsOverlay = document.querySelector('.day-options-overlay')
        dayOptionsOverlay.classList.remove('show-day');
        dayOptionsOverlay.classList.add('hide-day');
        setDayContentDisplay('inline-block');

    }

    // Animtes the showing of the day options.
    const showDayContents = () => {
        const cal = document.querySelector('.calendar .month-container');
        cal.classList.remove('grow-calendar');
        cal.classList.add('shrink-calendar');
        const dayOptionsOverlay = document.querySelector('.day-options-overlay')
        dayOptionsOverlay.classList.remove('hide-day');
        dayOptionsOverlay.classList.add('show-day');
        setDayContentDisplay('none');

    }

    // Component for the month.
    const CalendarMonth = ({ calMonthkey, monthData, icons, data, monthFromYear }) => {

        return (
            <div key={calMonthkey} className='month-container'>
                {
                    monthData.map((week, weekKey) => (
                        <div key={weekKey} className='week-container'>
                            {
                                week.map((dayData, dayKey) => (
                                    <CalendarDay fromYear={monthFromYear != undefined ? true : false} date={monthFromYear ? { month: monthFromYear, year: currentYear } : { month: currentMonth, year: currentYear }} key={dayKey} monthData={monthData} dayData={dayData} icons={icons} data={data} handleDayClicked={handleDayClicked} contentDisplay={dayContentDisplay}></CalendarDay>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        );
    };

    // Component for the year dialogue.
    const CalendarYear = ({ styles }) => (
        <div className='year-overlay-grid'>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month, monthIttr) => (
                <div key={month} className='year-overlay-month-container pointer' onClick={() => handleMonthClicked(month)}>
                    <span className='month-title'>{dateFormatter.getMonthString(month)}</span>
                    <div className='year-overlay-month'>
                        <CalendarMonth key={monthIttr} monthFromYear={month} icons={{ notes: true, emoji: true, moon: false }} monthData={getMonthData(currentYear, month)} inCurrentMonthStyles='in-current-month' notInCurrentMonthStyles='hidden'></CalendarMonth>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className='content-container'>
            {yearCalendarShown &&
                <div className='year-overlay'>
                    <div className='year-overlay-heading-container'>
                        <div onClick={() => handleCloseYearOverlay()} className='pointer exit'></div>
                        <div className='year-ovlerlay-options'>
                            <img src={leftArrowLight} onClick={() => handlePrevYearClicked()} className='pointer' />
                            <h2 className='text'>{currentYear}</h2>
                            <img src={rightArrowLight} onClick={() => handleNextYearClicked()} className='pointer' />
                        </div>
                    </div>
                    <CalendarYear></CalendarYear>
                </div>
            }
            <div className='day-options-overlay' >
                <DayOptions data={dataObject} date={{ dayNumber: dayData.dayNumber, monthNumber: currentMonth, yearNumber: currentYear }} saveOnClose={saveOnClose} updateUI={updateUI} handleDayArrowClicked={handleDayArrowClicked}></DayOptions>
            </div>
            <div className='calendar'>
                <div className='calendar-options-container'>
                    <img src={leftArrow} onClick={() => handlePrevMonthClicked()} className='pointer' />
                    <img src={rightArrow} onClick={() => handleNextMonthClicked()} className='pointer' />
                    <img src={calendarIcon} onClick={() => handleOpenYearOverlay()} className='pointer' />
                </div>
                <div className='month-container'>
                    <div className='month-text-container'>{dateFormatter.getMonthString(currentMonth)} {currentYear}</div>
                    <div className='day-of-week-container'>
                        <span>S</span>
                        <span>M</span>
                        <span>T</span>
                        <span>W</span>
                        <span>T</span>
                        <span>F</span>
                        <span>S</span>
                    </div>
                    <CalendarMonth icons={{ notes: true, emoji: true, moon: true }} monthData={getMonthData(currentYear, currentMonth)} data={getInitialDayData()}></CalendarMonth>
                </div>
            </div>
        </div>
    );
}