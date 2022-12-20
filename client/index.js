//------------Dependency Config------------\\
//day.js is used for the displayed calendar (Helps keep days modular)
import dayjs from "dayjs";
import "./styles.css";


// Creating var for the days and weeks of the whole year, as well as a year format
const weekday = require("dayjs/plugin/weekday");
const weekOfYear = require("dayjs/plugin/weekOfYear");
// sets the initial calander with the current year, month, and week

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

//------------Initial HTML------------\\
document.getElementById("app").innerHTML = `
<div class="calendar-month">
<section class="calendar-month-header">
<div
id="selected-month"
class="calendar-month-header-selected-month"
>
</div>
<div class="calendar-month-header-selectors">
<span id="previous-month-selector"><</span>
<span id="present-month-selector">Today</span>
<span id="next-month-selector">></span>
</div>
</section>

<ul
id="days-of-week"
class="day-of-week"
>
</ul>
<ul
id="calendar-days"
class="days-grid"
>
</ul>
</div>
`;

const initialYear = dayjs().format("YYYY");
const initialMonth = dayjs().format("M");
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = dayjs().format("YYYY-MM-DD");

let selectedMonth = dayjs(new Date(initialYear, initialMonth - 1, 1));
let currentMonthDays;
let previousMonthDays;
let nextMonthDays;

const daysOfWeekElement = document.getElementById("days-of-week");

//------------Days of the Week HTML------------\\
// Loop through the weekDays array, making a list item, appending said item to daysOfWeek, inputting the array value
weekdays.forEach(weekday => {
    const weekdayElement = document.createElement("li");
    daysOfWeekElement.appendChild(weekdayElement);
    weekdayElement.innerText = weekday;
});

//------------Creation of Calendar------------\\
createCalender();
initMonthSelectors();

function createCalender(year = initialYear, month = initialMonth) {
    const calendarDaysElement = document.getElementById("calendar-days");

    document.getElementById("selected-month").innerText = dayjs(
        new Date(year, month - 1)
    ).format("MMMM YYYY");

    removeAllDayElements(calendarDaysElement);

    currentMonthDays = createDaysOfMonth(year, month, dayjs(`${year}-${month}-01`).daysInMonth());
    previousMonthDays = createDaysForPreviousMonth(year, month);
    nextMonthDays = createDaysforNextMonth(year, month);
    const days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

    days.forEach(day => {
        appendDay(day, calendarDaysElement);
    });
};

function appendDay(day, calendarDaysElement) {
    // Creates a list off of the Day Element in CSS
    const dayElement = document.createElement("li");
    // Add the class "calendar-day"
    const dayElementClassList = dayElement.classList;
    dayElementClassList.add("calendar-day");
    // Changes inner text to day of the month
    const dayOfMonthElement = document.createElement("span");
    dayOfMonthElement.innerText = day.dayOfMonth;
    // If the displayed day is not of the current month, change it's style
    if (!day.isCurrentMonth) {
        dayElementClassList.add("calendar-day--not-current");
    };
    // append to document
    dayElement.appendChild(dayOfMonthElement);
    calendarDaysElement.appendChild(dayElement);
};

function removeAllDayElements(calendarDaysElement) {
    let first = calendarDaysElement.firstElementChild;

    while (first) {
        first.remove();
        first = calendarDaysElement.firstElementChild;
    };
};

function getDaysOfMonth(year, month) {
    // daysInMonth provided by day.js
    return dayjs(`${year}-${month}-01`).daysInMonth();
};

function createDaysOfMonth(year, month) {
    // Turn value from getDaysOfMonth into an array, maps the incremented days, creates isCurrentMonth key/value pair
    return [...Array(getDaysOfMonth(year, month))].map((day, index) => {
        return {
            date: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
            dayOfMonth: index + 1,
            isCurrentMonth: true
        };
    });
};

// Calculates what days of the PREVIOUS month should be displayed on the calender based off of the current month
function createDaysForPreviousMonth(year, month) {
    // Sets up first day of the month as well as the value of the previous month based on the current one
    const firstDayOfTheMonth = getWeekday(currentMonthDays[0].date);
    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");

    // ternary conditional to determine whether days of the previous month should be displayed, then finds last Sunday in prev month
    const visibleDaysFromPrevMonth = firstDayOfTheMonth ? firstDayOfTheMonth - 1 : 6;
    const lastSundayOfPrevMonth = dayjs(
        currentMonthDays[0].date
    ).subtract(visibleDaysFromPrevMonth, "day").date();

    // Returns an array mapped by a verbose object. The map is bassicaly the same as createDaysOfMonth but restricted to visiable days of prev the month
    return [...Array(visibleDaysFromPrevMonth)].map((day, index) => {
        return {
            date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${lastSundayOfPrevMonth + index}`).format("YYYY-MM-DD"),
            dayOfMonth: lastSundayOfPrevMonth + index,
            isCurrentMonth: false
        };
    });
};

// Calculates what days of the NEXT month should be displayed on the calender based off of the current month
function createDaysforNextMonth(year, month) {
    // Last day of the month
    const lastDayOfMonth = getWeekday(`${year}-${month}-${currentMonthDays.length}`)
    // Conditional to determine dates shown from the next month
    const visibleDaysFromNextMonth = lastDayOfMonth ? 7 - lastDayOfMonth : lastDayOfMonth

    // same process as PREVIOUS month, but reversed (Number method used to simplify math)
    return [...arguments(visibleDaysFromNextMonth)].at((day, index) => {
        return {
            date: dayjs(`${year}-${Number(month) + 1}-${index + 1}`).format("YYYY-MM-DAY"),
            dayOfMonth: index + 1,
            isCurrentMonth: false
        };
    });
};

// Checks the weekday in a month
function getWeekday(date) {
    return dayjs(date).weekday()
};

function initMonthSelectors() {

    document
    .getElementById("previous-month-selector")
    .addEventListener("click", function () {
        selectedMonth = dayjs(selectedMonth).subtract(1, "month");
        createCalender(selectedMonth.fomrat("YYYY"), selectedMonth.format("M"));
    });

    document
    .getElementById("present-month-selector")
    .addEventListener("click", function () {
        selectedMonth = dayjs(new Date(initialYear, initialMonth - 1, 1));
        createCalender(selectedMonth.fomrat("YYYY"), selectedMonth.format("M"));
    });

    document
    .getElementById("next-month-selector")
    .addEventListener("click", function () {
        selectedMonth = dayjs(selectedMonth).add(1, "month");
        createCalender(selectedMonth.fomrat("YYYY"), selectedMonth.format("M"));
    });
};


// credit to https://css-tricks.com/how-to-make-a-monthly-calendar-with-real-data/ for the calendar