const countryHTML = document.getElementById("country");
const cityHTML = document.getElementById("city");
const zoneHTML = document.getElementById("zone");
const hourHTML = document.getElementById("hour");
const minutesHTML = document.getElementById("minutes");
const timeFieldHTML = document.getElementById("timeField");
const timezoneHTML = document.getElementById("timeZone");
const weekDayHTML = document.getElementById("weekDay");
const currentWeekHTML = document.getElementById("currentWeek");
const dayOfYearHTML = document.getElementById("dayOfYear");
const refreshButton = document.getElementById("refreshQuote");
const greetings = document.querySelector("span");
const switchButton = document.querySelector("#switch span");
const infosContainer = document.getElementById("infosContainer");
const quoteContentHTML = document.querySelector("q");
const quoteAuthorHTML = quoteContentHTML.nextElementSibling;
let isSwitched = false;

(async () => {
   getData();
   getQuote();
})();

async function getData() {
   const response = await fetch("http://ip-api.com/json/", {
      referrerPolicy: "unsafe_url",
   });
   data = await response.json();
   countryCode = data.countryCode;
   city = data.city;
   timezone = data.timezone;
   displayDataInfos();
   getInitialTimeData();
   getAdditionnalTimeDatas();
}

async function getQuote() {
   const response = await fetch(
      "https://programming-quotes-api.herokuapp.com/Quotes/random"
   );
   quoteData = await response.json();
   quoteContentHTML.innerText = quoteData.en;
   quoteAuthorHTML.innerText = quoteData.author;
}

function displayDataInfos() {
   countryHTML.innerText = countryCode;
   cityHTML.innerText = city;
   zoneHTML.innerText = timezone;
}

function getInitialTimeData() {
   let hours = moment.tz(timezone).format("HH");
   let minutes = moment.tz(timezone).format("mm");
   const timestamp = Date.now();
   hourHTML.innerText = hours;
   minutesHTML.innerText = minutes;
   timezoneHTML.innerText = moment.tz.zone(timezone).abbr(timestamp);

   let Seconds = moment.tz(timezone).format("ss");
   const timer = setTimeout(() => {
      callClockUpdate();
      return () => {
         clearTimeout(timer);
      };
   }, 60000 - Seconds * 1000);
   displayBackground(Number(hours));
   displayCorrectIcon(Number(hours));
}

function callClockUpdate() {
   refreshTimeInfos();
   let i = 0;
   console.log("c'est parti");
   setInterval(() => {
      refreshTimeInfos();
      i++;
      console.log(`Ça fait ${i} minute`);
   }, 60000);
}

function refreshTimeInfos() {
   let minutes = moment.tz(timezone).format("mm");
   let hours = moment.tz(timezone).format("HH");
   if (Number(minutes) == 00) {
      console.log("Passage à nouvelle heure, il est  " + hours + ":" + minutes);
      hourHTML.innerText = hours;
      minutesHTML.innerText = minutes;
      getAdditionnalTimeDatas();
      displayBackground();
      greetings.innerText = displayGreetings(Number(hours));
      displayCorrectIcon(Number(hours));
   } else {
      hourHTML.innerText = hours;
      minutesHTML.innerText = minutes;
   }
}
function getAdditionnalTimeDatas() {
   let momentDate = moment().date();
   let dateInTimeZone = moment().tz(timezone).format("DD");
   let dayOfWeek = moment().weekday();
   let dayOfTheYear = moment().dayOfYear();
   let currentWeek = moment().isoWeek();

   dayOfWeek === 0 && (dayOfWeek = 7);
   if (momentDate < Number(dateInTimeZone)) {
      dayOfWeek = dayOfWeek == 7 ? dayOfWeek - 6 : dayOfWeek + 1;
      weekDayHTML.innerText = dayOfWeek;
      dayOfYearHTML.innerText = dayOfTheYear + 1;

      if (Number(dayOfWeek) == 1) {
         currentWeekHTML.innerText = currentWeek + 1;
      } else {
         currentWeekHTML.innerText = currentWeek;
      }
   } else if (momentDate > Number(dateInTimeZone)) {
      dayOfWeek = dayOfWeek == 1 ? dayOfWeek + 6 : dayOfWeek - 1;
      weekDayHTML.innerText = dayOfWeek;
      dayOfYearHTML.innerText = dayOfTheYear - 1;
      if (Number(dayOfWeek) == 7) {
         currentWeekHTML.innerText = currentWeek - 1;
      } else {
         currentWeekHTML.innerText = currentWeek;
      }
   } else {
      weekDayHTML.innerText = dayOfWeek;
      dayOfYearHTML.innerText = dayOfTheYear;
      currentWeekHTML.innerText = currentWeek;
   }
}

function displayGreetings(hours) {
   let greetingsMessage = "";
   if (hours >= 5 && hours < 12) {
      greetingsMessage =
         window.innerWidth >= 768
            ? "Good morning, it's currently"
            : "Good morning";
   } else if (hours >= 12 && hours < 18) {
      greetingsMessage =
         window.innerWidth >= 768
            ? "Good afternoon, it's currently"
            : "Good afternoon";
   } else {
      greetingsMessage =
         window.innerWidth >= 768
            ? "Good Evening, it's currently"
            : "Good Evening";
   }
   return greetingsMessage;
}

function displayBackground() {
   let hours = Number(moment.tz(timezone).format("HH"));
   if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      document.documentElement.style.setProperty(
         "--image",
         hours < 18 && hours >= 05
            ? 'url("./assets/tablet/bg-image-daytime.jpg")'
            : 'url("./assets/tablet/bg-image-nighttime.jpg")'
      );
   } else if (window.innerWidth >= 1024) {
      document.documentElement.style.setProperty(
         "--image",
         hours < 18 && hours >= 05
            ? 'url("./assets/desktop/bg-image-daytime.jpg")'
            : 'url("./assets/desktop/bg-image-nighttime.jpg")'
      );
   } else {
      document.documentElement.style.setProperty(
         "--image",
         hours < 18 && hours >= 05
            ? 'url("./assets/mobile/bg-image-daytime.jpg")'
            : 'url("./assets/mobile/bg-image-nighttime.jpg")'
      );
   }
   adjustInfosStyle(hours);
   greetings.innerText = displayGreetings(hours);
}
function displayCorrectIcon(hours) {
   const icon = greetings.previousElementSibling;
   icon.setAttribute(
      "src",
      hours < 18 && hours >= 05
         ? "./assets/desktop/icon-sun.svg"
         : "./assets/desktop/icon-moon.svg"
   );
   icon.setAttribute(
      "alt",
      hours < 18 && hours >= 05 ? "sun icon" : "moon icon"
   );
}

function toggleDisplay() {
   isSwitched = !isSwitched;
   const container = document.querySelector("body div");
   const img = switchButton.firstElementChild;
   const buttonText = switchButton.previousElementSibling;

   img.classList.toggle("rotate-180");
   img.setAttribute("alt", isSwitched ? "reduce" : "expand");
   buttonText.innerText = isSwitched ? "less" : "more";
   container.classList.toggle("lg:mt-[-50vh]");
   container.classList.toggle("md:mt-[-43vh]");
   container.classList.toggle("mt-[-38.4vh]");
}

function adjustInfosStyle(hours) {
   hours < 18 && hours >= 05
      ? infosContainer.classList.add("day")
      : infosContainer.classList.add("night");
   hours < 18 && hours >= 05
      ? infosContainer.classList.remove("night")
      : infosContainer.classList.remove("day");
}

refreshButton.addEventListener("click", () => {
   getQuote();
   return () => {
      refreshButton.removeEventListener();
   };
});

switchButton.addEventListener("click", () => {
   toggleDisplay();
   return () => {
      switchButton.removeEventListener();
   };
});

window.addEventListener("resize", () => {
   displayBackground();
   displayGreetings();
   return () => {
      window.removeEventListener();
   };
});
