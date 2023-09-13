const yourWeather = document.querySelector(".yourWeatherTab");
const searchWeather = document.querySelector(".searchWeatherTab");
const grantLocationAccess = document.querySelector(".grantLocationAccess");
const loadingContainer = document.querySelector(".loadingContainer");
const searchContainer = document.querySelector(".searchContainer");
const weatherInformation = document.querySelector(".weatherInformation");

const API_KEY = 'b2fe3cfefb2e17167e69fa798f3799d9';
/* console.log(API_KEY); */
let oldTab = yourWeather;
oldTab.classList.add("current-tab");
grantLocationAccess.classList.add("active");
getFromSessionStorage();
/* let content1 = oldTab.classList;
console.log(content1); */
function switchTab(clickedTab){

    if(oldTab != clickedTab){
        oldTab.classList.remove("current-tab");
        let content2 = oldTab.classList;
        console.log(content2);
        oldTab = clickedTab;
        oldTab.classList.add("current-tab");

        if(!searchContainer.classList.contains("active")){
            loadingContainer.classList.remove("active");
            grantLocationAccess.classList.remove("active");
            weatherInformation.classList.remove("active");
            searchContainer.classList.add("active");
            
        }

        else{
            //if there is a search tab
            searchContainer.classList.remove("active");
            weatherInformation.classList.remove("active");
            //Find your coordinates
            getFromSessionStorage();
        }
    }

}

yourWeather.addEventListener("click",()=>{
    switchTab(yourWeather);
})

searchWeather.addEventListener("click",()=>{
    switchTab(searchWeather);
})

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinate");

    if(!localCoordinates){
        grantLocationAccess.classList.add("active");
        loadingContainer.classList.remove("active");
        searchContainer.classList.remove("active");
        weatherInformation.classList.remove("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}

const locationNotFound = document.querySelector(".locationNotFound");

async function fetchWeatherInfo(coordinates){
    const{lat , lon} = coordinates;

    loadingContainer.classList.add("active");
    grantLocationAccess.classList.remove("active");
    

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        loadingContainer.classList.remove("active");
        weatherInformation.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        loadingContainer.classList.remove("active");
         locationNotFound.classList.add("active"); 
    }
}

function renderWeatherInfo(weatherInfo){
    const city = document.querySelector(".cityName");
    const countryFlag = document.querySelector("[countryFlag]");
    const weatherDescription = document.querySelector(".weatherDescription");
    const weatherDescriptionImage = document.querySelector(".weatherDescriptionImage");
    const weatherDescriptionTemperature = document.querySelector(".weatherDescriptionTemperature");
    /* const parameterContainer = document.querySelector(".parameterContainer"); */
    const windSpeed = document.querySelector(".windSpeed");
    const humidity = document.querySelector(".humidity");
    const clouds = document.querySelector(".clouds");
    /* console.log(weatherInfo); */
    city.innerText = weatherInfo?.name;
    /* console.log(city.innerText); */
    countryFlag.src = `https://flagcdn.com//144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
    weatherDescription.innerText = weatherInfo?.weather?.[0]?.description;
    weatherDescriptionImage.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    weatherDescriptionTemperature.innerText = `${weatherInfo?.main?.feels_like} k`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all} %`;
}

const grantLocationAccessButton = document.querySelector(".grantLocationAccessButton");



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        locationNotFound.classList.add("active");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinate",JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

grantLocationAccessButton.addEventListener("click", getLocation);

const inputField = document.querySelector(".searchContainerInput");

searchContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = inputField.value;

    if(cityName === " "){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingContainer.classList.add("active");
    searchContainer.classList.add("active");
    weatherInformation.classList.remove("active");

    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        let data =await response.json();
        loadingContainer.classList.remove("active");
        weatherInformation.classList.add("active");
        searchContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        locationNotFound.classList.add("active");
        loadingContainer.classList.remove("active");
    }
}