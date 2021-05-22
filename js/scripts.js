/*!
 * Start Bootstrap - Scrolling Nav v5.0.0 (https://startbootstrap.com/template/scrolling-nav)
 * Copyright 2013-2021 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/master/LICENSE)
 */
//
// Scripts
//

"use strict";

window.addEventListener("DOMContentLoaded", (event) => {
  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      offset: 74,
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });
});

// HERE COME MY COVIN SCRIPT

var timer;
var min_age_limit = 18;
var dose = 1;
var nextTime = 10000; // Math.floor(30000 + Math.random() * 60000);

const API_URL = "https://cdn-api.co-vin.in/api";

const headers = {
  // mode: 'no-cors',
  accept: "application/json",
};

// headers['access-control-allow-origin']= "http://127.0.0.1:5500/";
// headers['Accept-Language']= "hi_IN"; //"Accept-Language: hi_IN"

const options = {
  method: "GET",
  headers,
  referrerPolicy: "no-referrer",
  referrer: "https://www.cowin.gov.in/",
};

async function getStateDistricts(stateId) {
  if (!stateId) {
    stateId = "35";
  }
  const url = API_URL + "/v2/admin/location/districts/" + stateId;

  const res = await fetch(url, options).then((res) => res.json());
  return res.districts;
}

async function getAppointmentsByDistricts(districtId, date) {
  if (!districtId) {
    districtId = "705";
  }
  if (!date) {
    date = new moment().format("DD-MM-YYYY");
  }
  const url =
    API_URL +
    `/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`;

  const res = await fetch(url, options).then((res) => res.json());
  return res.centers;
}

function beep() {
  var snd = new Audio(
    "https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3"
  );
  snd.play();
}

function getResultTarget() {
  return document.getElementById("available_data");
}

function getAvailabilityParametersInfoTarget() {
  return document.getElementById("availability_parameters_info");
}

function getNextCallInfoTarget() {
  return document.getElementById("next_call_info");
}

// console.log('res > ', getStateDistricts(35).then(r => console.log(r)));

async function fetchData(stateId) {
  if (!stateId) {
    stateId = "35";
  }
  let districts = await getStateDistricts(stateId);
  districts = districts.filter(
    (d) =>
      d.district_name === "Nainital" || d.district_name === "Udham Singh Nagar"
  );
  //   console.log(districts);
  await districts.map(async (d) => {
    const date = new moment();
    const appointments = await getAppointmentsByDistricts(
      d.district_id,
      date.format("DD-MM-YYYY")
    );
    console.log(d.district_name, appointments);
    const available = []; // appointments.filter((a) => a.available_capacity_dose1);
    // const availableStrings = [];
    appointments.map((a) => {
      const sessions = a.sessions;
      if (sessions && sessions.length) {
        sessions.map((session) => {
          if (
            session &&
            session.min_age_limit === min_age_limit &&
            session[`available_capacity_dose${dose}`]
          ) {
            available.push({
              ...a,
              ...session,
            });
            var str =
              "🎉 Available " +
              session[`available_capacity_dose${dose}`] +
              " slots in " +
              d.district_name +
              " on " +
              date.format("DD-MM-YYYY") +
              " at " +
              a.name +
              " " +
              a.address;
            console.log(str);

            var para = document.createElement("li");
            var node = document.createTextNode(str);
            para.appendChild(node);

            var element = getResultTarget();
            element.appendChild(para);
          }
        });
      }
    });
    console.log("available", available);
    if (available.length) {
      console.log(
        "available in",
        d.district_name,
        "on",
        date.format("DD-MM-YYYY")
      );
      console.log(available);
      beep();
    }
  });
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function startOp() {
  //   document.getElementsByClassName("pin-search-btn district-search")[0].click();
  //   document.getElementById("flexRadioDefault2").click();
  //document.getElementById("flexRadioDefault5").click()
  //   showAvailable();
  const container = getResultTarget();
  removeAllChildNodes(container);
  const info = getAvailabilityParametersInfoTarget();
  info.innerHTML = `
    Checking results for age ${min_age_limit} and for dose ${dose}
  `;
  fetchData();
  console.log(
    "🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧"
  );
  const nextCallTime =
    "Next call at: " +
    new Date(Date.now() + nextTime).getHours() +
    ":" +
    new Date(Date.now() + nextTime).getMinutes() +
    ":" +
    new Date(Date.now() + nextTime).getSeconds();
    // +  ":" +
    // new Date(Date.now() + nextTime).getMilliseconds();
  const nextcallInfo = getNextCallInfoTarget();
  nextcallInfo.innerHTML = nextCallTime;

  timer = setTimeout(startOp, nextTime);
}

function stopOp() {
  clearTimeout(timer);
  alert("stopped");
  const info = getAvailabilityParametersInfoTarget();
  info.innerHTML = "";
  const nextcallInfo = getNextCallInfoTarget();
  nextcallInfo.innerHTML = "";
}
