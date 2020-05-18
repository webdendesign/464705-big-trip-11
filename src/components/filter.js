import moment from 'moment';
import AbstractComponent from "./abstract-component.js";
import {FilterType} from '../const.js';

export default class Filter extends AbstractComponent {

  constructor(filters, model) {
    super();
    this._filters = filters;
    this._model = model;
  }

  getDisabledItems(filter) {
    const nowDate = moment();
    const allPoints = this._model.getPointsAll();
    switch (filter.title) {
      case FilterType.ALL:
        return allPoints.length;
      case FilterType.FUTURE:
        return allPoints.filter((item) => item.startTime > nowDate).length;
      case FilterType.PAST:
        return allPoints.filter((item) => item.startTime < nowDate).length;
    }
    return 0;
  }

  createFilter(filter) {
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${filter.title}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.title}" ${filter.isChecked ? `checked` : ``} ${(this.getDisabledItems(filter)) ? `` : `disabled`} >
        <label class="trip-filters__filter-label" for="filter-${filter.title}">${filter.title}</label>
      </div>`
    );
  }

  reloadFilterState() {
    const elements = document.getElementsByClassName(`trip-filters__filter-input`);
    for (const element of elements) {
      if (element) {
        element.disabled = false;
      }
    }
  }

  getTemplate() {
    this.reloadFilterState();
    return (
      `<form class="trip-filters" action="#" method="get">
          ${this._filters.map((filter) => this.createFilter(filter)).join(`\n`)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
    );
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      handler(evt.target.value);
    });
  }
}
