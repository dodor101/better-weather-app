const cityFormEl = $('#form-city');
const searchHistoryBtn = $('#display-search-history');
const cityInput = $('#city-name');
const displayToday = $('#display-today');

const display5DayForecast = $('#display-five-forecast');

const APIKey = '3911b3545970347c6b98f6c645c609f0';
async function getGeo(city) {
  // only accept type String
  if (typeof city !== 'string') {
    alert('You must use Letters only!');
    return;
  }
  // declare  queryURL
  const queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`;

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

async function getCity() {
  let city = cityInput.val();
  if (!city) {
    return alert('Enter a city 🙂');
  }
  let weatherData = await getGeo(city);

  // destructure lat & lon
  const { lat, lon } = weatherData[0];

  let coordinate = await getCoordination(lat, lon);

  renderData(coordinate);

  cityInput.val('');
}

cityFormEl.on('submit', (event) => {
  event.preventDefault();
  getCity();
});

// write a function that print
function renderData(data) {
  console.log(data);

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
    weatherImg.attr('src', `http://openweathermap.org/img/w/${weatherIcon}.png`);
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
    let wind = `Wind:  ${windSpeed}MPH`;
    let humidityValue = `Humidity:  ${humidity}%`;
    dateEl.text(withDayJs);
    weatherImg.text(weatherImg);
    temperature.text(temp);
    windEl.text(wind);
    humidityEl.text(humidityValue);

    div.append(dateEl, weatherImg, temperature, windEl, humidityEl);
    div.attr('class', 'd-flex flex-column gap p-2  w-fit ');

    display5DayForecast.append(div).attr('class', 'd-flex  gap-2 p-2 col-12 col-md-6 col-lg-8');
  }
}
