const search = document.getElementById('search');
const results = document.getElementById('results');
const button = document.getElementById('search-button');
const found_info = document.getElementById('info-found');

/*
The following keys should not be written in this code, as this represents a security failure. 
*/
const MAPBOX_KEY = 'pk.eyJ1IjoiamFyZWRhZ3VpcnJlODIiLCJhIjoiY2tsZWw3ODEzMGZqZTJvcXBuM3FsMGtyNyJ9.NPsPY9Q_Uwez4K_uwj5cSw'
const WEATHER_KEY = 'a3fae46261c6966cd2111d0b84d0aab0';

var lista_sugerencias = [];

axios.get('http://localhost:8081/secrets')
    .then((res) => console.log(res))

const getSuggestions = (data) => {

    let obj = data.map((place_unit) => {
        return {
            id: place_unit.id,
            place_name_es: place_unit.place_name_es,
            lat: place_unit.center[1],
            lon: place_unit.center[0]
        }
    })
    return obj;
}

//input Listener
search.addEventListener('input', () => {


    //Let's prepare the axios instance to make the request
    const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${search.value}.json?`,
        params: {
            access_token: MAPBOX_KEY,
            language: 'es',
            limit: 5
        }
    });
    //Now we perform a GET of that instance
    instance.get()
        .then((res) => {
            lista_sugerencias = getSuggestions(res.data.features);

            if (lista_sugerencias.length > 0) {
                let html = lista_sugerencias.map((place) => {
                    return `<option value=\"${place.place_name_es}\"></option>`;
                });
                html.join('\n');
                results.innerHTML = html;

            }
            else {
                results.innerHTML = '';
            }
        })
        .catch(() => console.log('No hay resultados'))
})

//Let's prepare the actions after pressing the search button
button.addEventListener('click', () => {

    //This will only proceed to action if there is any suggestions
    if (lista_sugerencias.length > 0 || search.value != '') {

        //We use the search bar content to look for coincidences on the suggestion list
        //If there is any, we use that coincidence to get data. If not, we intuit it's the first one
        let match_place = {};
        let given_place = {};
        match_place = lista_sugerencias.find((e) => e.place_name_es == search.value);
        if (match_place === undefined) {
            given_place = lista_sugerencias[0];
        }
        else {
            given_place = match_place;
        }
        console.log(given_place);

        //Let's prepare the instance for the next request
        const instance_b = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
            params: {
                lat: given_place.lat,
                lon: given_place.lon,
                lang: 'es',
                appid: WEATHER_KEY,
                units: 'metric'
            }
        });

        //Making the GET request of previous instance
        instance_b.get()
            .then((res) => {
                //Writing a piece of html text using some of the obtained parameters
                var html = `
                <h2 class="results-place">${given_place.place_name_es.toUpperCase()}</h2>
                <h2 class="results">Estado general: ${res.data.weather[0].description}</h2>
                <h2 class="results">Temperatura actual: ${res.data.main.temp}&#8451</h2>
                <h2 class="results">Sensacion térmica: ${res.data.main.feels_like}&#8451</h2>
                <h2 class="results">MAX: ${res.data.main.temp_max}&#8451</h2>
                <h2 class="results">MIN: ${res.data.main.temp_min}&#8451</h2>`

                found_info.innerHTML = html;
                
            })
            .catch((err) => {
                console.log(err)
            })
    }
});