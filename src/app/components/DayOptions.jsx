/*
 The UI for the day settings overlay.
*/
import React, { useRef, useEffect, useState } from 'react';
//Styles
import '../styles/day-options.css';
//Script
import dateFormatter from '../script/dateFormatter';
//Hooks
import useLoggerState from '../hooks/useLoggerState';
//Global Constants
import emojiIcons from '../script/staticConstants';

export default function DayOptions({ data, date, saveOnClose, handleDayArrowClicked, updateUI }) {
    const [emojis, setEmojis] = useState(setInitialEmojis());
    const [notes, setNotes] = useState(setInitialNotes());
    const [blood, setBlood] = useState(setInitialBlood());
    const [dayNumber, setDayNumber] = useState(date.dayNumber);

    const cycleStartedHolder = useRef(null);

    // Update when the date has changed.
    useEffect(() => {
        setEmojis(setInitialEmojis());
        setNotes(setInitialNotes());
        setBlood(setInitialBlood());
    }, [dayNumber]);

    useEffect(() => {
        setDayNumber(date.dayNumber);
    })

    // Update the note emoji when the 'notes' state is changed.
    useEffect(() => {
        setNoteIcon()
    }, [notes]);

    // Set the emojis for the respective calendar day.
    function setInitialEmojis() {
        if (data[date.yearNumber])
            if (data[date.yearNumber][date.monthNumber])
                if (data[date.yearNumber][date.monthNumber][date.dayNumber])
                    if (data[date.yearNumber][date.monthNumber][date.dayNumber]['emojis'])
                        return data[date.yearNumber][date.monthNumber][date.dayNumber]['emojis'];

        return [];
    }
    // Set the notes for the respective calendar day.
    function setInitialNotes() {
        if (data[date.yearNumber])
            if (data[date.yearNumber][date.monthNumber])
                if (data[date.yearNumber][date.monthNumber][date.dayNumber])
                    if (data[date.yearNumber][date.monthNumber][date.dayNumber]['notes'])
                        return data[date.yearNumber][date.monthNumber][date.dayNumber]['notes'];

        return "";
    }
    // Set the notes for the respective calendar day.
    function setInitialBlood() {
        if (data[date.yearNumber])
            if (data[date.yearNumber][date.monthNumber])
                if (data[date.yearNumber][date.monthNumber][date.dayNumber])
                    if (data[date.yearNumber][date.monthNumber][date.dayNumber]['blood'])
                        return data[date.yearNumber][date.monthNumber][date.dayNumber]['blood'];

        return false;
    }

    // Set the note icon for the respective calendar day.
    function setNoteIcon() {

        if (notes) {
            if (notes.trim() !== "") {

                //check if the container contains a note icon already
                let containsNoteIcon = false;
                for (let emoji of emojis) {
                    if (emoji === 'noteIcon') {
                        containsNoteIcon = true;
                        break;
                    }
                };

                if (!containsNoteIcon)
                    setEmojis(['noteIcon', ...emojis])
            }
        } else {
            setEmojis(emojis.filter(emoji => emoji !== 'noteIcon'));
        }

        saveData(emojis.filter(emoji => emoji !== 'noteIcon'), notes, blood);

    }

    // Check whether the current day of the iteration is the selected day.
    function isToday(day, month, year) {
        return (day === date.dayNumber && month === date.monthNumber && year === date.yearNumber);
    }

    // Check whether the day of the month is before the selected day.
    function beforeToday(startYear, startMonth, startDay) {
        const currentDate = new Date(date.yearNumber, date.monthNumber, date.dayNumber);
        const startDate = new Date(startYear, startMonth, startDay);
        return startDate < currentDate;
    }

    // Updates the view when the user selects an icon from the day options menu (emojis, blood start/end, or notes).
    const handleOptionSelected = option => {

        const optionsContainer = document.querySelector('.options-icon-container');
        const wolfOption = optionsContainer.children[0];
        const bloodOption = optionsContainer.children[1];
        const noteOption = optionsContainer.children[2];

        const optionsContainerContent = document.querySelector('.options-content-container');
        const wolfOptionContent = optionsContainerContent.children[0];
        const bloodOptionContent = optionsContainerContent.children[1];
        const noteOptionContent = optionsContainerContent.children[2];

        wolfOption.classList.remove('day-option-selected');
        noteOption.classList.remove('day-option-selected');
        bloodOption.classList.remove('day-option-selected');
        wolfOptionContent.classList.remove('visible');
        noteOptionContent.classList.remove('visible');
        bloodOptionContent.classList.remove('visible');
        //Choose between wolf, note, and blood
        if (option === 'wolf') {
            wolfOption.classList.add('day-option-selected');
            wolfOptionContent.classList.add('visible');
            return;
        }
        else if (option === 'blood') {
            bloodOption.classList.add('day-option-selected');
            bloodOptionContent.classList.add('visible');
            return;
        }
        else if (option === 'note') {
            noteOption.classList.add('day-option-selected');
            noteOptionContent.classList.add('visible');
            return;
        }
    }

    const saveData = (e, n, b) => {
        const returnObject = {
            emojis: e,
            notes: n,
            blood: b
        };

        saveOnClose(returnObject, date.yearNumber, date.monthNumber, date.dayNumber);
        updateUI();
    };

    const handleEmojiClicked = emoji => {

        if (emojis.includes(emoji)) {
            const newList = emojis.filter(emojiIttr => emojiIttr !== emoji);
            setEmojis(newList);
            saveData(newList, notes, blood);
        } else{
            setEmojis([emoji, ...emojis]);
            saveData([emoji, ...emojis], notes, blood);
        }
    }

    const handleBledTodayClicked = () => {
        setBlood(true);
        saveData(emojis, notes, true);
    }

    const handleBledTodayCanceled = () => {
        setBlood(false);
        saveData(emojis, notes, false);
    }

    const findNextEmptyDay = day => {

        const daysInMonth = new Date(date.yearNumber, date.monthNumber + 1, 0).getDate();
        for (let day = date.dayNumber; day <= daysInMonth; day++) {
            if (data?.[date.yearNumber]?.[date.monthNumber]?.[date.dayNumber + 1]?.['blood'] === true) {
                continue;
            }else{
                return day;
            }
        };
        return daysInMonth;
    }

    const findPrevEmptyDay = () => {

    }

    return (
        <div className='day-options-container' key={date.dayNumber}>
            <div className='arrow' onClick={() => handleDayArrowClicked()}>
                <div className='down-arrow'></div>
                <div className='down-arrow'></div>
            </div>
            <div className='options-inner-container'>
                <div className='options-icon-container'>

                    <img src={emojiIcons['neutral']} className='day-option-selected day-option-pointer' onClick={() => handleOptionSelected('wolf')}></img>
                    <img src={emojiIcons['bloodDrip']} className='day-option-pointer' onClick={() => handleOptionSelected('blood')}></img>
                    <img src={emojiIcons['noteIcon']} className='day-option-pointer' onClick={() => handleOptionSelected('note')}></img>
                </div>
                <div className='options-content-container'>
                    <div className='wolf-container options-content-container-child visible'>
                        <div className='wolf-container-image-container'>
                            <img id='happy' className='day-option-pointer' src={emojiIcons['happy']} onClick={(e) => handleEmojiClicked(e.target.id)}></img>
                        </div>
                        <div className='wolf-container-image-container'>
                            <img id='love' className='day-option-pointer' src={emojiIcons['love']} onClick={(e) => handleEmojiClicked(e.target.id)}></img>
                        </div>
                        <div className='wolf-container-image-container'>
                            <img id='ouch' className='day-option-pointer' src={emojiIcons['ouch']} onClick={(e) => handleEmojiClicked(e.target.id)}></img>
                        </div>
                        <div className='wolf-container-image-container'>
                            <img id='angry' className='day-option-pointer' src={emojiIcons['angry']} onClick={(e) => handleEmojiClicked(e.target.id)}></img>
                        </div>
                        <div className='wolf-container-image-container'>
                            <img id='sad' className='day-option-pointer' src={emojiIcons['sad']} onClick={(e) => handleEmojiClicked(e.target.id)}></img>
                        </div>
                        <div className='wolf-container-image-container'>
                            <img id='sleepy' className='day-option-pointer' src={emojiIcons['sleepy']} onClick={(e) => handleEmojiClicked(e.target.id)}></img>
                        </div>
                        <div className='wolf-container-image-container'>
                            <img id='stressed' className='day-option-pointer' src={emojiIcons['stressed']} onClick={(e) => handleEmojiClicked(e.target.id)}></img>
                        </div>
                    </div>
                    <div className='blood-container options-content-container-child'>

                        {blood &&
                            <>
                                <div className='blood-image-container'>
                                    {/* <span>{`${dateFormatter.getMonthString(cycleStarted.month)} ${cycleStarted.day}, ${cycleStarted.year}`}</span> */}
                                    <img src={emojiIcons['bloodStartLight']}></img>
                                </div>
                                <div className='blood-image-container pointer' onClick={() => handleBledTodayCanceled()}>
                                    <img src={emojiIcons['bloodDrip']}></img>
                                    <span>did not bleed today</span>
                                </div>
                                <div className='blood-image-container'>
                                    {/* <span>{`${dateFormatter.getMonthString(date.month)} ${findNextEmptyDay(date.dayNumber)}, ${date.year}`}</span> */}
                                    <img src={emojiIcons['bloodEndLight']}></img>
                                </div>
                            </>
                        }
                        {!blood &&
                            <>
                                <div className='blood-image-container pointer' onClick={() => handleBledTodayClicked()}>
                                    <img src={emojiIcons['bloodDrip']}></img>
                                    <span>bled today</span>
                                </div>
                            </>
                        }

                    </div>
                    <div className='note-container options-content-container-child'>
                        <textarea autoFocus className='note-textarea' value={notes} onChange={event => setNotes(event.target.value)}></textarea>
                    </div>
                </div>
                <div className='options-day-screen-container'>
                    <div className={blood ? 'options-day-screen blood-day' : 'options-day-screen'} >
                        <section className='date'>
                            <p>{dayNumber}</p>
                        </section>
                        <section className='emoji-icon-container'>
                            {/* EMOJIS GO HERE */}
                            {emojis.map((emoji, key) => <img key={key} id={emoji} src={emojiIcons[emoji]} />)}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}