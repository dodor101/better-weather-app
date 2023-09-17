const cityFormEl = $('#form-city');
const searchHistoryBtn = $('#display-search-history');
const cityInput = $('#city-name');
const displayToday = $('#display-today');

const display5DayForecast = $('#display-five-forecast');
// APIKey
const APIKey = '341c47e0aaaaa23b914e146587331d70';

async function getCurrentWeather(lat, lon) {
  // declare  queryURL
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`;
  // fetch data with ajax
  const getCurrentData = await $.ajax({
    url: queryURL,
    method: 'GET',
  });
  return getCurrentData;
}

// get Geolocation
async function getGeo(city) {
  // only accept type String
  if (typeof city !== 'string') {
    alert('You must use Letters only!');
    return;
  }

  // declare  queryURL
  const queryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;

  // fetch data with ajax
  const getData = await $.ajax({
    url: queryURL,
    method: 'GET',
  });

  return getData;
}

// getGeoCoordination
async function getCoordination(lat, lon) {
  let coordinationQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

  const getData = await $.ajax({
    url: coordinationQuery,
    method: 'GET',
  });
  return getData;
}

async function getCity(city = cityInput.val()) {
  if (typeof city !== 'string') {
    alert('You must use Letters only!');
    return;
  }

  if (!city) {
    return alert('Enter a city 🙂');
  }
  storeCity(city);
  let weatherData = await getGeo(city);

  clearData();
  // destructure lat & lon
  const { lat, lon } = weatherData[0];
  // current forecast
  let currentWeather = await getCurrentWeather(lat, lon);

  renderCurrentWeather(currentWeather);

  // five day forecast
  let coordinate = await getCoordination(lat, lon);

  renderData(coordinate);

  cityInput.val('');
}

// get weather button
cityFormEl.on('submit', async (event) => {
  event.preventDefault();
  try {
    await getCity(cityInput.val());
  } catch (error) {
    console.log(error);
  }
});

function renderCurrentWeather(currentWeather) {
  let withDayJs = dayjs().format('MM/DD/YYYY');
  // create HTML element
  const div = $('<div>');
  const headingEl = $('<p>');
  const temperature = $('<p>');
  const weatherImg = $('<img>');
  const windEl = $('<p>');
  const humidityEl = $('<p>');

  displayToday.empty();

  let cityNameEl = currentWeather.name;
  let weatherIcon = currentWeather.weather[0].icon;
  let temp = currentWeather.main.temp;
  let fahrenheit = ((temp - 273.15) * 9) / 5 + 32;
  let wind = currentWeather.wind;
  let humidity = currentWeather.main.humidity;
  weatherImg.attr('src', `https://openweathermap.org/img/w/${weatherIcon}.png`);

  const heading = `${cityNameEl} (${withDayJs})`;

  headingEl.text(heading);
  temperature.text(`Temp: ${fahrenheit.toFixed()}°F`);
  windEl.text(`Wind: ${wind.speed} MPH`);
  humidityEl.text(`Humidity: ${humidity}%`);

  div.append(headingEl, weatherImg, temperature, windEl, humidityEl);

  displayToday.append(div);
}

// write a function that print
function renderData(data) {
  for (let i = 0; i < 5; i++) {
    const div = $('<div>');
    const dateEl = $('<p>');
    const temperature = $('<p>');
    const weatherImg = $('<img>');
    const windEl = $('<p>');
    const humidityEl = $('<p>');

    let weatherData = data.list[i * 8];
    // weather icon
    let weatherIcon = weatherData.weather[0].icon;
    weatherImg.attr('src', `https://openweathermap.org/img/w/${weatherIcon}.png`);
    // wind
    let windSpeed = weatherData.wind.speed;
    let humidity = weatherData.main.humidity;
    let date = weatherData.dt_txt.split(' ')[0];
    // format date
    let formatDate = date.replaceAll('-', '/');
    let withDayJs = dayjs(formatDate).format('MM/DD/YY');

    let tempResult = weatherData.main.temp;

    // convert to fahrenheit
    let fahrenheit = ((tempResult - 273.15) * 9) / 5 + 32;

    let temp = `Temp:  ${fahrenheit.toFixed()}°F`;
    let wind = `Wind:  ${windSpeed} MPH`;
    let humidityValue = `Humidity:  ${humidity}%`;

    dateEl.text(withDayJs);
    temperature.text(temp);
    windEl.text(wind);
    humidityEl.text(humidityValue);
    div.append(dateEl, weatherImg, temperature, windEl, humidityEl);
    div.attr('class', 'd-flex flex-column fs-4 gap px-4  w-100  bg-primary');

    display5DayForecast.append(div).attr('class', 'd-flex w-100  gap-4 p-2 col-12 col-md-6 col-lg-8  ');
  }
}

// store cities search in localStorage
function storeCity(city) {
  // Check if localStorage is supported in the browser
  if (typeof localStorage !== 'undefined') {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];

    if (cities.includes(city)) {
      return;
    }

    // Add the new city to the array
    cities.push(city);

    // Store the updated array back in localStorage
    localStorage.setItem('cities', JSON.stringify(cities));
  } else {
    console.error('LocalStorage is not supported in this browser.');
  }
}

// print cities as buttons

function renderSearchHistory(searchHistory) {
  searchHistory?.forEach((city, index) => {
    const searchCityEl = $('<input>');

    searchCityEl.attr('class', 'btn custom-btn w-100 fs-3  mb-2');
    searchCityEl.attr('data-id', `${index}`);
    searchCityEl.attr('value', `${city}`);
    searchCityEl.attr('type', `button`);
    searchCityEl.attr('pattern', `[A-Za-z]+`);
    searchCityEl.attr('title', 'Enter letters only');

    searchHistoryBtn.append(searchCityEl);
  });
}

function clearData() {
  // Remove all child elements (old data)
  display5DayForecast.empty();
}

function getItems() {
  const cities = JSON.parse(localStorage.getItem('cities')) || [];

  if (cities.length) {
    renderSearchHistory(cities);
  }
}
getItems();

// search history btn even
searchHistoryBtn.on('click', async (e) => {
  e.stopImmediatePropagation();
  let city = e.target.value;
  try {
    await getCity(city);
  } catch (error) {
    console.log(error);
  }
});
