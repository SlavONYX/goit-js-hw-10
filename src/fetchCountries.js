export function fetchCountries(name) {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
    .then(response=> {

    if (!response.ok) {
        throw new Error(responce.status);
    }
    return response.json();
    });
  }

  fetchCountries('uk')
  .then(data=>console.log(data))