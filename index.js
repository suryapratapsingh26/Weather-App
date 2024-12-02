const container = document.querySelector('.container');
const search = document.querySelector('.search-btn');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

search.addEventListener('click', () => {
    const APIKey = '8dfea170e116aff2865bdc564f7dbaf7';
    const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            // More precise matching of weather conditions
            switch (json.weather[0].main.toLowerCase()) {
                case 'clear':
                    image.src = "images/clear.png";
                    break;

                case 'rain':
                    image.src = 'images/rain.png';
                    break;

                case 'snow':
                    image.src = 'images/snow.png';
                    break;

                case 'clouds':
                    image.src = 'images/cloud.png';
                    break;

                case 'haze':
                case 'mist':
                    image.src = 'images/mist.png';
                    break;
                
                default:
                    image.src = 'images/cloud.png'; // Default to cloud image if condition not matched
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '600px';
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            error404.style.display = 'block';
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
        });
});

// Add event listener for Enter key
document.querySelector('.search-box input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        search.click();
    }
});