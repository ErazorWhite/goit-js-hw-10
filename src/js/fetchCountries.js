export class restCountriesAPI {
  #BASE_URL = 'https://restcountries.com/v3.1/name/';
  #query = '';

  getCoutryByQuerry() {
    const params = new URLSearchParams({
      fields: 'name,capital,population,flags,languages',
    });
    const url = `${this.#BASE_URL}${this.#query}?${params}`;

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }
    
  set query(newQuery) {
    this.#query = newQuery;
  }
}
