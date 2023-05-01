import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { restCountriesAPI } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const api = new restCountriesAPI();

const searchInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');

function onInput() {
  const searchQuerry = searchInputEl.value.trim();

  if (!searchQuerry) {
    Notify.info('Try enter something in search box');
    return;
  }

  api.query = searchQuerry;
  api
    .getCoutryByQuerry()
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length > 1 && countries.length <= 10) {
        renderContryList(countries);
        return;
      } else if (countries.length === 1) {
        renderCountry(countries);
        return;
      }
    })
    .catch(error => {
      if (error == 'Error: 404') {
        Notify.failure(`Oops, there is no country with that name`);
        return;
      } else {
        Notify.failure(`Unknown error`);
        console.log(error);
      }
    });
}

function renderCountry(country) {
  const markup = country
    .map(
      ({
        flags: { svg },
        name: { official },
        capital,
        languages,
        population,
      }) => {
        return `
        <div class="country-thumb">
            <img src="${svg}" alt="Flag" width=25>    
            <h2 class="country-name">${official}</h2>
        </div>
        <p class="country-data"><b>Capital: </b>${capital}</p>
        <p class="country-data"><b>Population: </b>${population}</p>
        <p class="country-data"><b>Languages: </b>${Object.values(
          languages
        ).join(', ')}</p>`;
      }
    )
    .join('');
  countryListEl.innerHTML = markup;
}

function renderContryList(countries) {
  const markup = countries
    .map(({ name: { official }, flags: { svg } }) => {
      return `
        <li class="country-item">
            <img src="${svg}" alt="Flag" width=75>    
            <p><b>${official}</b></p>
        </li>`;
    })
    .join('');
  countryListEl.innerHTML = markup;
}

searchInputEl.addEventListener('keydown', debounce(onInput, DEBOUNCE_DELAY));
