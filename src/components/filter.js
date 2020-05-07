import AbstractComponent from "./abstract-component.js";

export default class Filter extends AbstractComponent {

  constructor(filters, model) {
    super();
    this._filters = filters;
    this._model = model;
  }

  createFilter(filter) {
    return (`<div class="trip-filters__filter">
        <input id="filter-${filter.title}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.title}" ${filter.isChecked ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${filter.title}">${filter.title}</label>
    </div>`);
  }

  getTemplate() {
    return (`<form class="trip-filters" action="#" method="get">
          ${this._filters.map((filter) => this.createFilter(filter)).join(`\n`)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      handler(evt.target.value);
    });
  }
}
