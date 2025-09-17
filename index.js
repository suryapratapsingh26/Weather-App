const container = document.querySelector('.container');
const searchButton = document.querySelector('.search-btn');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const searchInput = document.querySelector('.search-box input');

// Store references to the elements that will be updated
const weatherImage = document.querySelector('.weather-box img');
const temperature = document.querySelector('.weather-box .temperature');
const description = document.querySelector('.weather-box .description');
const humidity = document.querySelector('.weather-details .humidity span');
const wind = document.querySelector('.weather-details .wind span');
const searchIcon = document.querySelector('.search-btn i');
const clearButton = document.querySelector('.clear-btn');
const getLocationButton = document.querySelector('.get-location-btn');

const APIKey = '8dfea170e116aff2865bdc564f7dbaf7'; // Note: For production, this should be kept secret on a server.

const setLoadingState = (isLoading) => {
    searchButton.disabled = isLoading;
    getLocationButton.disabled = isLoading;
    if (isLoading) {
        searchIcon.classList.remove('fa-magnifying-glass');
        searchIcon.classList.add('fa-spinner', 'fa-spin');
    } else {
        searchIcon.classList.remove('fa-spinner', 'fa-spin');
        searchIcon.classList.add('fa-magnifying-glass');
    }
};

const fetchWeatherData = async (url) => {
    setLoadingState(true);
    try {
        const response = await fetch(url);
        const json = await response.json();
        if (json.cod === '404') {
            showError();
        } else {
            updateWeatherData(json);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError();
    } finally {
        setLoadingState(false);
    }
};

const showError = () => {
    container.style.height = '400px';
    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    error404.style.display = 'block';
    error404.classList.add('fadeIn');
};

const updateWeatherData = (data) => {
    // If the search input is empty (which it is on a location search),
    // populate it with the city name from the API response.
    if (searchInput.value === '' || data.name !== searchInput.value.toUpperCase()) {
        searchInput.value = data.name;
        clearButton.classList.add('active');
    }

    error404.style.display = 'none';
    error404.classList.remove('fadeIn');

    const weatherCondition = data.weather[0].main.toLowerCase();
    const weatherImages = {
        'clear': 'images/clear.png',
        'rain': 'images/rain.png',
        'snow': 'images/snow.png',
        'clouds': 'images/cloud.png',
        'mist': 'images/mist.png',
        'haze': 'images/mist.png'
    };
    // Default to the cloud image if the condition isn't in our map
    weatherImage.src = weatherImages[weatherCondition] || weatherImages['clouds']; 
    
    temperature.innerHTML = `${parseInt(data.main.temp)}<span>°C</span>`;
    description.innerHTML = `${data.weather[0].description}`;
    humidity.innerHTML = `${data.main.humidity}%`;
    wind.innerHTML = `${parseInt(data.wind.speed)}Km/h`;
    
    weatherBox.style.display = '';
    weatherDetails.style.display = '';
    weatherBox.classList.add('fadeIn');
    weatherDetails.classList.add('fadeIn');
    container.style.height = '600px';
};

const handleSearch = () => {
    const city = searchInput.value;
    if (city === '') return;

    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
    fetchWeatherData(API_URL);
};

searchButton.addEventListener('click', handleSearch);

// Add event listener for Enter key
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Show/hide clear button based on input
searchInput.addEventListener('input', () => {
    if (searchInput.value.length > 0) {
        clearButton.classList.add('active');
    } else {
        clearButton.classList.remove('active');
    }
});

// Handle clear button click
clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.classList.remove('active');
    searchInput.focus(); // Keep the user in the input field
});

// Handle location button click
getLocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

const onSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`;
    searchInput.value = ''; // Clear input to signal a location search
    fetchWeatherData(API_URL);
};

const onError = (error) => {
    console.error("Geolocation Error:", error);
    alert(`Could not get your location: ${error.message}`);
};