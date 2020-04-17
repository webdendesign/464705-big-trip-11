import {createElement} from "../utils.js";

const createFilterMarkup = (period, isChecked) => {
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${period}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${period}" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${period}">${period}</label>
    </div>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((filter, i) => createFilterMarkup(filter.period, i === 0)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
    </form>`
  );
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
