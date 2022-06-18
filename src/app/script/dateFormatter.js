const getMonthString = month => {

    switch (month) {
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
            return "December";
        default:
            return "";
    }
}

const getDaysInCurrentCalendar = (year, month) => {
    //setFullYear(yearValue, monthValue, dateValue)
    //Day of month and Day of week is zero indexed. All others are intuitive.
    //Sunday - Saturday : 0 - 6
    //Jan - Dec : 0 - 11
    //e.g. date.setDate(2020, 1, 1) is the 1st February 2020

    const firstSunday = getSundayBeforeMonth(year, month);
    const daysInPreviousMonth = getDaysInPrevMonth(year, month);
    const daysInCurrentMonth = getDaysInMonth(year, month);
    const lastSaturday = getSaturdayAfterMonth(year, month);

    return {
        firstSunday,
        daysInPreviousMonth,
        daysInCurrentMonth,
        lastSaturday
    }
}

const getSundayBeforeMonth = (year, month) => {

    //Get the day of the first of the month
    const date = new Date(year, month, 1);
    let dayOfWeek = date.getDay();
    date.setDate(date.getDate() - dayOfWeek);
    return date.getDate();
}

const getDaysInMonth = (year, month) => {
    //Get the last day of the current month
    return new Date(year, ((month + 1) % 12), 0).getDate();

}

const getDaysInPrevMonth = (year, month) => {
    //Get the last day of the current month
    return new Date(year, month, 0).getDate();

}

const getSaturdayAfterMonth = (year, month) => {

    const lastDayOfMonth = getDaysInMonth(year, month);
    const date = new Date(year, month, lastDayOfMonth);
    const dayOfWeek = date.getDay();
    //To find the last Saturday, the day needs to equal 6
    const daysUntilSaturday = 6 - dayOfWeek;

    date.setDate(date.getDate() + daysUntilSaturday);

    return date.getDate();

}

const increaseMonth = (year, month) => {
    let newMonth = month;
    let newYear = year;
    newMonth++;
    if(newMonth===12){
        newMonth = 0;
        newYear++;
    }
    return {
        newYear,
        newMonth
    }
}
const decreaseMonth = (year, month) => {
    let newMonth = month;
    let newYear = year;
    newMonth--;
    if(newMonth<0){
        newMonth = 11;
        newYear--;
    }
    return {
        newYear,
        newMonth
    }
}

module.exports.getDaysInCurrentCalendar = getDaysInCurrentCalendar;
module.exports.decreaseMonth = decreaseMonth;
module.exports.increaseMonth = increaseMonth;
module.exports.getMonthString = getMonthString;
