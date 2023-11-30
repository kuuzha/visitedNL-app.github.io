// Define an object to store the city data for each province
const provinces = {
  Drenthe: {
    cities: ["assen", "emmen", "hoogeveen"],
    visitedCount: 0
  },
  Flevoland: {
    cities: ["lelystad", "almere", "dronten", "emmeloord"],
    visitedCount: 0
  },
  Friesland: {
    cities: [
      "leeuwarden",
      "drachten",
      "sneek",
      "heerenveen",
      "harlingen",
      "joure",
      "wolvega"
    ],
    visitedCount: 0
  },
  Gelderland: {
    cities: [
      "nijmegen",
      "apeldoorn",
      "arnhem",
      "ede",
      "doetinchem",
      "zutphen",
      "tiel"
    ],
    visitedCount: 0
  },
  Groningen: {
    cities: ["groningen", "hoogezand", "veendam", "stadskanaal"],
    visitedCount: 0
  },
  Limburg: {
    cities: ["maastricht", "venlo", "heerlen"],
    visitedCount: 0
  },
  North_Brabant: {
    cities: [
      "eindhoven",
      "tilburg",
      "breda",
      "s-hertogenbosch",
      "helmond",
      "roosendaal",
      "oss"
    ],
    visitedCount: 0
  },
  North_Holland: {
    cities: ["amsterdam", "haarlem", "ijmuiden", "alkmaar", "hilversum"],
    visitedCount: 0
  },
  Overijssel: {
    cities: ["enschede", "zwolle", "deventer", "almelo"],
    visitedCount: 0
  },
  South_Holland: {
    cities: ["rotterdam", "denhaag", "leiden", "dordrecht"],
    visitedCount: 0
  },
  Utrecht: {
    cities: ["utrecht", "amersfoort"],
    visitedCount: 0
  },
  Zeeland: {
    cities: ["vlissingen", "middelburg", "goes", "terneuzen"],
    visitedCount: 0
  }
};

//generate HTML code for list of cities and provinces
const citySetContainer = document.getElementById("citySetContainer");
for (const provinceName in provinces) {
  const province = provinces[provinceName];

  const citySet = document.createElement("div");
  citySet.classList.add("city-set");

  const citySetProvince = document.createElement("div");
  citySetProvince.classList.add("city-set-province");

  const provinceNameElement = document.createElement("h3");
  provinceNameElement.classList.add("province-name");
  provinceNameElement.textContent = provinceName.replace(/_/g, " "); // Replace underscores with spaces for display

  const provincePercentage = document.createElement("h3");
  provincePercentage.classList.add("province-percentage");
  provincePercentage.id = `${provinceName.replace(/\s+/g, "")}-percentage`;
  provincePercentage.textContent = "0%";

  citySetProvince.appendChild(provinceNameElement);
  citySetProvince.appendChild(provincePercentage);

  const citySetCities = document.createElement("div");
  citySetCities.classList.add("city-set-cities");

  province.cities.forEach((city) => {
    const cityLabel = document.createElement("label");
    cityLabel.classList.add("animated-checkbox");

    const cityCheckbox = document.createElement("input");
    cityCheckbox.type = "checkbox";
    cityCheckbox.id = city.toLowerCase();
    cityCheckbox.onchange = function () {
      markCity(city.toLowerCase());
    };

    const cityCheckboxDiv = document.createElement("div");
    cityCheckboxDiv.classList.add("checkbox");

    const cityName = document.createElement("span");
    cityName.textContent = city
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("-");

    cityLabel.appendChild(cityCheckbox);
    cityLabel.appendChild(cityCheckboxDiv);
    cityLabel.appendChild(cityName);

    citySetCities.appendChild(cityLabel);
  });

  citySet.appendChild(citySetProvince);
  citySet.appendChild(citySetCities);

  citySetContainer.appendChild(citySet);
}

// Mark a city as visited
function markCity(cityId) {
  const checkbox = document.getElementById(cityId);
  const cityName = checkbox.nextElementSibling;
  const checkedCities = getCheckedCities();

  if (checkbox.checked) {
    cityName.style.fontWeight = "bold";
    checkedCities.push(cityId);
  } else {
    cityName.style.fontWeight = "normal";
    const index = checkedCities.indexOf(cityId);
    if (index > -1) {
      checkedCities.splice(index, 1);
    }
  }

  saveCheckedCities();
  calculatePercentage();
  updateMap();
  updateProvincePercentage();
}

// Save checked cities to localStorage
function saveCheckedCities() {
  const checkedCities = getCheckedCities();
  localStorage.setItem("checkedCities", JSON.stringify(checkedCities));
}

// Restore checked cities from localStorage
function restoreCheckedCities() {
  const checkedCities = localStorage.getItem("checkedCities");
  if (checkedCities) {
    const parsedCities = JSON.parse(checkedCities);
    parsedCities.forEach((cityId) => {
      const checkbox = document.getElementById(cityId);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
  }
}

// Hook event listeners and initialize the app
function initializeApp() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => markCity(checkbox.id));
  });

  restoreCheckedCities();
  calculatePercentage();
  updateProvincePercentage();
  updateMap();
}

// Calculate the percentage of visited cities
function calculatePercentage() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const checkedCount = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  ).length;
  const totalCount = checkboxes.length;
  const percentage = Math.round((checkedCount / totalCount) * 100);
  document.getElementById("percentage").textContent = `${percentage}%`;
}

// Update the percentage of visited cities for each province
function updateProvincePercentage() {
  const provinceElements = document.querySelectorAll("h3.province-name");

  provinceElements.forEach((provinceElement) => {
    const provinceName = provinceElement.textContent;
    const province = provinces[provinceName.replace(/ /g, "_")]; // Modify the province name to match the object key
    const visitedCount = getVisitedCityCount(province.cities);
    const percentage = Math.round(
      (visitedCount / province.cities.length) * 100
    );
    provinceElement.nextElementSibling.textContent = `${percentage}%`;
  });
}

// Get the checked cities from localStorage
function getCheckedCities() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const checkedCities = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id);
  return checkedCities;
}

// Get the count of visited cities in a given array of city IDs
function getVisitedCityCount(cityIds) {
  const checkedCities = getCheckedCities();
  return cityIds.reduce((count, cityId) => {
    if (checkedCities.includes(cityId)) {
      return count + 1;
    }
    return count;
  }, 0);
}

// Update the fill color of the provinces on the map
function updateMap() {
  const provinceElements = document.querySelectorAll("h3.province-name");

  provinceElements.forEach((provinceElement) => {
    const provinceName = provinceElement.textContent.replace(" ", "_");
    const pathElements = document.querySelectorAll(`.${provinceName}`);

    pathElements.forEach((pathElement) => {
      updateProvinceColor(pathElement, getProvincePercentage(provinceName));
    });
  });
}

// Update the fill color of province based on visited cities percentage
function updateProvinceColor(pathElement, percentage) {
  if (percentage <= 15) {
    pathElement.setAttribute("fill", "#BFBFBF");
  } else if (percentage <= 30) {
    pathElement.setAttribute("fill", "#C8BEA0");
  } else if (percentage <= 45) {
    pathElement.setAttribute("fill", "#D1BD82");
  } else if (percentage <= 60) {
    pathElement.setAttribute("fill", "#DBBC63");
  } else if (percentage <= 75) {
    pathElement.setAttribute("fill", "#E4BC45");
  } else if (percentage <= 90) {
    pathElement.setAttribute("fill", "#EDBB27");
  } else {
    pathElement.setAttribute("fill", "#F6BA0A");
  }
}

// Get the percentage of visited cities for a given province
function getProvincePercentage(provinceName) {
  const province = provinces[provinceName];
  if (!province) {
    console.error(`Province '${provinceName}' not found.`);
    return null;
  }

  const visitedCount = getVisitedCityCount(province.cities);
  const percentage = Math.round((visitedCount / province.cities.length) * 100);
  return percentage;
}

initializeApp();

// Get references to the SVG paths and hint element
const svg = document.getElementById("map");
const hint = document.getElementById("hint");

// Function to show the hint with the path class
function showHint(pathClass, x, y) {
  hint.textContent = pathClass;
  hint.style.display = "block";

  // Calculate the maximum allowed positions for the hint
  const maxTop = y - hint.offsetHeight;

  // Adjust the hint position if it would go beyond the screen boundaries
  const adjustedX = Math.max(
    Math.min(x - hint.offsetWidth / 2, window.innerWidth - hint.offsetWidth),
    0
  );
  const adjustedY = Math.max(maxTop, 0);

  hint.style.top = `${adjustedY}px`;
  hint.style.left = `${adjustedX}px`;
}

// Function to hide the hint
function hideHint() {
  hint.style.display = "none";
}

// Add click event listeners to the SVG paths
svg.addEventListener("click", function (event) {
  const target = event.target;
  const pathClass = target.getAttribute("class");
  const x = event.clientX;
  const y = event.clientY;

  showHint(pathClass.replace("_", " "), x, y);

  // Hide the hint after a certain duration (e.g., 3 seconds)
  setTimeout(hideHint, 3000);
});

window.addEventListener("scroll", function () {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var mapSvg = document.getElementById("map-svg");
  var hints = document.getElementsByClassName("hint");

  if (scrollTop > 0) {
    mapSvg.style.width = "40%";
    hideHint();
  } else {
    var mapSvgWidth =
      85 -
      (scrollTop /
        (document.documentElement.scrollHeight - window.innerHeight)) *
        60;
    mapSvg.style.width = mapSvgWidth + "%";
  }
});
