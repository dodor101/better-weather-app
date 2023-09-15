// console.log('Hello World');
// let date = dayjs().format('DD/MM/YYYY');
// console.log(date);
const cityFormEl = $('#form-city');
const searchHistoryBtn = $('#display-search-history');
const cityInput = $('#city-name');

const APIKey = '3911b3545970347c6b98f6c645c609f0';
async function getWeatherInfo(city) {
  // only accept type String
  if (typeof city !== 'string') {
    alert('You must use Letters only!');
    return;
  }
  // declare  queryURL
  const queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;

  // fetch data with ajax
  const getData = await $.ajax({
    url: queryURL,
    method: 'GET',
  });

  return getData;
}

async function getCity() {
  let city = cityInput.val();
  let weatherData = await getWeatherInfo(city);
  printData(weatherData);
}
cityFormEl.on('submit', (event) => {
  event.preventDefault();
  getCity();
});

// write a function that print

function printData(data) {
  console.log(data);
}
