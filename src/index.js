import './css/styles.css';
import NewsApiService from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  searchForm: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  clearCauntryContainer();

  newsApiService.query = e.target.value.trim();
	newsApiService
		.fetchCountries()
		.then(appendCauntryMarkup);
}

function appendCauntryMarkup(cauntry) {
  if (!cauntry) {
    return Notiflix.Notify.failure('Oops, there is no country with that name');
  }
  if (cauntry.length >= 10) {
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (cauntry.length < 10 || cauntry.length > 1) {
    refs.countryList.insertAdjacentHTML('beforeend', allCauntryEl(cauntry));
  }
  if (cauntry.length === 1) {
    clearCauntryContainer();
    refs.countryInfo.insertAdjacentHTML('beforeend', oneCauntryEl(cauntry));
  }
}

function oneCauntryEl(cauntry) {
  return cauntry
    .map(
      ({
        flags,
        name,
        capital,
        languages,
        population,
      }) => `<ul class="one-cauntry">
		<li class="one-cauntry__item">
		<img src="${flags.svg}" alt="flag of ${
        name.official
      }" width="60" height="40"></li>
		<li class="one-cauntry__item">${name.official}</li>
		<li class="one-cauntry__item">${capital}</li>
		<li class="one-cauntry__item">${Object.values(languages)}</li>
	<li class="one-cauntry__item">${population}</li>
	</ul>`
    )
    .join('');
}

function allCauntryEl(cauntry) {
  return cauntry
    .map(
      ({ flags, name }) =>
        `<li class="country__item"><img src="${flags.svg}" alt="flag of ${name.official}" width="60" height="40"><p class="country__name">${name.official}</p></li></li>`
    )
    .join('');
}

function clearCauntryContainer() {
	refs.countryInfo.innerHTML = '';
	refs.countryList.innerHTML = '';
}
