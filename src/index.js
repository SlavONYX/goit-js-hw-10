import './css/styles.css';
import Notiflix, {
    Notify
} from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
// Debounce delay for input event
const DEBOUNCE_DELAY = 300;

// DOM elements
const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

// Clears the inner HTML of an element
function clearMarkup(ref) {
    ref.innerHTML = '';
}
// Handles input event on search box
function inputHendler(e) {
    // Trim whitespace from input value
    const {
        value: inputValue
    } = e.target;

    // If input is empty, clear country list and info
    if (!inputValue) {
        clearMarkup(refs.countryList);
        clearMarkup(refs.countryInfo);
        return;
    }

    // Fetch countries matching input value
    fetchCountries(inputValue)
        .then(data => {
            // If more than 10 matches found, display info message
            if (data.length > 10) {
                return Notify.info(
                    'Too many matches found. Please enter a more specific name'
                );
            }
            if (data.length === 1) {
                clearMarkup(refs.countryList);
                refs.countryInfo.innerHTML = createInfoMarkup(data[0]);
            } else {
                // If multiple matches found, render list markup
                clearMarkup(refs.countryInfo);
                refs.countryList.innerHTML = createListMarkup(data);
            }
        })
        .catch(error => {
            // If there is an error, clear country list and info and display error message
            clearMarkup(refs.countryList);
            clearMarkup(refs.countryInfo);
            Notify.failure('Oops, there is no country with that name');
        });
}
// Creates list markup for multiple country matches
function createListMarkup(data) {
    return data
        .map(
            ({
                name,
                flags
            }) =>
            `<li><img src="${flags.png}" alt="${name.official}">${name.official}</li>`
        )
        .join('');
}
// Creates info markup for single country match
function createInfoMarkup(data) {
    return `<h1></h1>
    <ul></ul>
    <li><img src="${data.flags.png}" alt="${data.name.official}"><b>${data.name.official}</b></li>
    <li><b>Capital</b>: ${data.capital}</li>
    <li><b>Population</b>: ${data.population}</li>
    <li><b>Languages</b>: ${Object.values(data.languages)}</li>`;
}


refs.searchBox.addEventListener(
    'input',
    debounce(inputHendler, DEBOUNCE_DELAY)
);
