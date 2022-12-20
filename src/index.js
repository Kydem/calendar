//------------Dependency Config------------\\
//day.js is used for the displayed calendar (Helps keep days modular)
import dayjs from "dayjs";
import "./styles.css";

dayjs().format;
// Creating var for the days and weeks of the whole year, as well as a year format
const weekday = require("dayjs/plugin/weekday");
// sets the initial calander with the current year, month, and week
const weekOfYear = require("dayjs/plugin/weekOfYear");

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

//------------Initial HTML------------\\
document.getElementById("app").innerHTML = `
<div class="calendar-month">
  <section class="calendar-month-header">
    <div
      id="selected-month"
      class="calendar-month-header-selected-month"
    ></div>
    <section class="calendar-month-header-selectors">
      <span id="previous-month-selector"><</span>
      <span id="present-month-selector">Today</span>
      <span id="next-month-selector">></span>
    </section>
  </section>

  <ol
    id="days-of-week"
    class="day-of-week"
  /></ol>

  <ol
    id="calendar-days"
    class="days-grid"
  >
  </ol>
</div>
`;

const initialYear = dayjs().format("YYYY");
const initialMonth = dayjs().format("M");
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = dayjs().format("YYYY-MM-DD");

let selectedMonth = dayjs(new Date(initialYear, initialMonth - 1, 1));
let currentMonthDays;
let previousMonthDays;
let nextMonthDays;

const daysOfWeekElement = document.getElementById("days-of-week");

//------------Days of the Week HTML------------\\
// Loop through the weekDays array, making a list item, appending said item to daysOfWeek, inputting the array value
weekdays.forEach((weekday) => {
    const weekDayElement = document.createElement("li");
    daysOfWeekElement.appendChild(weekDayElement);
    weekDayElement.innerText = weekday;
  });

//------------Creation of Calendar------------\\
createCalendar();
initMonthSelectors();

function createCalendar(year = initialYear, month = initialMonth) {
    const calendarDaysElement = document.getElementById("calendar-days");
  
    document.getElementById("selected-month").innerText = dayjs(
      new Date(year, month - 1)
    ).format("MMMM YYYY");
  
    removeAllDayElements(calendarDaysElement);
  
    currentMonthDays = createDaysForCurrentMonth(
      year,
      month,
      dayjs(`${year}-${month}-01`).daysInMonth()
    );
  
    previousMonthDays = createDaysForPreviousMonth(year, month);
  
    nextMonthDays = createDaysForNextMonth(year, month);
  
    const days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
  
    days.forEach((day) => {
      appendDay(day, calendarDaysElement);
    });
  }

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
    dayElement.appendChild(dayOfMonthElement);
    calendarDaysElement.appendChild(dayElement);
    if (!day.isCurrentMonth) {
        dayElementClassList.add("calendar-day--not-current");
      };
    // append to document
    if (day.date === today) {
        dayElementClassList.add("calendar-day--today");
      };
};

function removeAllDayElements(calendarDaysElement) {
    let first = calendarDaysElement.firstElementChild;
  
    while (first) {
      first.remove();
      first = calendarDaysElement.firstElementChild;
    }
  }

  function getNumberOfDaysInMonth(year, month) {
    // daysInMonth provided by day.js
    return dayjs(`${year}-${month}-01`).daysInMonth();
};

function createDaysForCurrentMonth(year, month) {
    // Turn value from getDaysOfMonth into an array, maps the incremented days, creates isCurrentMonth key/value pair
    return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
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
    const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date);
    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");

    // ternary conditional to determine whether days of the previous month should be displayed, then finds last Sunday in prev month
    const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
    ? firstDayOfTheMonthWeekday - 1
    : 6;
    const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date)
    .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
    .date();

    // Returns an array mapped by a verbose object. The map is bassicaly the same as createDaysOfMonth but restricted to visiable days of prev the month
    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
        return {
          date: dayjs(
            `${previousMonth.year()}-${previousMonth.month() + 1}-${
              previousMonthLastMondayDayOfMonth + index
            }`
          ).format("YYYY-MM-DD"),
          dayOfMonth: previousMonthLastMondayDayOfMonth + index,
          isCurrentMonth: false
        };
    });
};

// Calculates what days of the NEXT month should be displayed on the calender based off of the current month
function createDaysForNextMonth(year, month) {
    // Last day of the month
    const lastDayOfTheMonthWeekday = getWeekday(
        `${year}-${month}-${currentMonthDays.length}`
      );

    const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");

    // Conditional to determine dates shown from the next month
    const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
    ? 7 - lastDayOfTheMonthWeekday
    : lastDayOfTheMonthWeekday;

    // same process as PREVIOUS month, but reversed (Number method used to simplify math)
    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
        return {
          date: dayjs(
            `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
          ).format("YYYY-MM-DD"),
          dayOfMonth: index + 1,
          isCurrentMonth: false
        };
      });
};

// Checks the weekday in a month
function getWeekday(date) {
    return dayjs(date).weekday();
};

function initMonthSelectors() {
    document
      .getElementById("previous-month-selector")
      .addEventListener("click", function () {
        selectedMonth = dayjs(selectedMonth).subtract(1, "month");
        createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
      });
  
    document
      .getElementById("present-month-selector")
      .addEventListener("click", function () {
        selectedMonth = dayjs(new Date(initialYear, initialMonth - 1, 1));
        createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
      });
  
    document
      .getElementById("next-month-selector")
      .addEventListener("click", function () {
        selectedMonth = dayjs(selectedMonth).add(1, "month");
        createCalendar(selectedMonth.format("YYYY"), selectedMonth.format("M"));
      });
};


// credit to https://css-tricks.com/how-to-make-a-monthly-calendar-with-real-data/ for the calendar