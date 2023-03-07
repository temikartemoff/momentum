const time = document.querySelector('.time');
const date = document.querySelector('.date');


const static = {
    city: 'Минск', language: 'ru', photoSource: 'GitHub', blocks: ['time', 'date','greeting', 'weather','quote', 'audio', 'todolist']
};

function showTime() {
  const today = new Date();
  currentTime = today.toTimeString();
  time.textContent = currentTime.split(' ')[0];
  options = {day: 'numeric',weekday: 'long',month: 'long'};
  currentDate = today.toLocaleDateString(static.language, options);
  date.textContent = currentDate;
  setTimeout(showTime, 1000);
};
showTime();

const greeting = document.querySelector('.greeting');
const userName = document.querySelector('.name');
const slidNext = document.querySelector('.slide-next');
const slidPrev = document.querySelector('.slide-prev');
const body = document.querySelector('body');

function getTimeOfDay() {
  const today = new Date()
  timeOfDay = '';
  greetingText = {};
  hours = today.getHours();
  if (6 <= hours && hours <= 11) {
    greetingText = {
      'ru': 'Доброе утро',
      'en': 'Good morning'
    };
    timeOfDay = 'morning'
  } else if (12 <= hours && hours <= 17) {
    greetingText = {
      'ru': 'Добрый день',
      'en': 'Good afternoon'
    };
    timeOfDay = 'afternoon'
  } else if (18 <= hours && hours <= 23) {
    greetingText = {
      'ru': 'Добрый вечер',
      'en': 'Good evening'
    };
    timeOfDay = 'evening'
  } else {
    greetingText = {
      'ru': 'Доброй ночи',
      'en': 'Good night'
    };
    timeOfDay = 'night'
  };
  greeting.textContent = greetingText[static.language];
  setTimeout(getTimeOfDay, 1000);
  return timeOfDay;
};
getTimeOfDay()
function setLocalStorage() {
  localStorage.setItem('name', userName.value)
};
window.addEventListener('beforeunload', setLocalStorage)
function getLocalStorage() {
  if (static.language === 'ru') {
    userName.placeholder = '[Введите имя]'
  } else {
    userName.placeholder = '[Enter name]'
  }
  if (localStorage.getItem('name')) {
    userName.value = localStorage.getItem('name')
  };
}
window.addEventListener('load', getLocalStorage);

function getRandomNum() {
    return Math.ceil(Math.random() * 20);
  };
  randomNum = getRandomNum();
  
  function getSlidNext() {
    if (randomNum === 20) randomNum = 0;
    randomNum++
    if (static.photoSource === 'GitHub') setBg();
    else if (static.photoSource === 'Unsplash') getLinkUnsplash();
    else if (static.photoSource === 'Flickr') getLinkFlickr();
    return randomNum;
  };
  slidNext.addEventListener('click', getSlidNext);
  
  function getSlidPrev() {
    if (randomNum === 1) randomNum = 21;
    randomNum--
    if (static.photoSource === 'GitHub') setBg();
    else if (static.photoSource === 'Unsplash') getLinkUnsplash();
    else if (static.photoSource === 'Flickr') getLinkFlickr();
    return randomNum;
  };
  slidPrev.addEventListener('click', getSlidPrev);
  function setBg() {
    if (static.photoSource === 'GitHub') {
      const timeOfDay = getTimeOfDay();
      const img = new Image();
      bgNum = String(randomNum).padStart(2, '0');
      img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
      img.addEventListener('load', () => {
        body.style.backgroundImage = `url(${img.src})`
      });
    }
    else if (static.photoSource === 'Unsplash') getLinkUnsplash();
    else if (static.photoSource === 'Flickr') getLinkFlickr();
  };
  setBg();
  function getLinkUnsplash() {
    const timeOfDay = getTimeOfDay();
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${timeOfDay}&client_id=TqFhLBt2qicqrSQsaEmtapczipfTjTlLhJXk-oL4aXw`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const img = new Image()
        img.src = data.urls.regular
        img.addEventListener('load', () => {
          body.style.backgroundImage = `url(${img.src})`
        });
      })
  };
  function getLinkFlickr() {
    const timeOfDay = getTimeOfDay()
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=60e0a6184a77c896dbba350f339c1488&tags=${timeOfDay}&extras=url_l&format=json&nojsoncallback=1`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const img = new Image()
        img.src = data.photos.photo[Math.ceil(Math.random() * 100)].url_l
        img.addEventListener('load', () => {
          body.style.backgroundImage = `url(${img.src})`
        });
      });
  };

  const city = document.querySelector('.city');
  const weatherIcon = document.querySelector('.weather-icon');
  const temperature = document.querySelector('.temperature');
  const weatherDescription = document.querySelector('.weather-description');
  const wind = document.querySelector('.wind');
  const humidity = document.querySelector('.humidity');

window.addEventListener('beforeunload', () => {
    localStorage.setItem('city', city.value)
  });
  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city')
  } else {
    city.value = static.city
  };
  function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${static.language}&appid=631fdaf2f4ca7046aa0c30d7826ff3be&units=metric`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.cod == 404 || city.value === '') {
          if (static.language === 'ru') {
            city.placeholder = 'Неверный город'
            alert('Город указан неверно')
          } else {
            city.placeholder = 'Wrong city'
          }
          city.value = '';
          weatherIcon.className = '';
          temperature.textContent = '';
          weatherDescription.textContent = '';
          wind.textContent = '';
          humidity.textContent = '';
        } else {
          let valueWindSpeed = {
            'en': `Wind speed: ${Math.round(data.wind.speed)} m/s`,
            'ru': `Скорость ветра: ${Math.round(data.wind.speed)} м/c`
          }
          valueHumidity = {
            'en': `Humidity: ${data.main.humidity}%`,
            'ru': `Влажность: ${data.main.humidity}%`
          }
          weatherIcon.className = 'weather-icon owf';
          weatherIcon.classList.add(`owf-${data.weather[0].id}`);
          temperature.textContent = `${Math.round(data.main.temp)}°C`;
          weatherDescription.textContent = data.weather[0].description;
          wind.textContent = valueWindSpeed[static.language];
          humidity.textContent = valueHumidity[static.language];
        };
      });
  };
  city.addEventListener('change', getWeather);
  getWeather()


