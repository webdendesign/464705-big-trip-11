import AbstractComponent from "./abstract-component.js";

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

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}
