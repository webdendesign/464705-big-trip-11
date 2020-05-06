import AbstractSmartComponent from "./abstract-smart-component.js";

import {getCities} from '../mock/city';
import {Types} from '../mock/data/types';
import {Options} from '../mock/data/options';


import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const createButtonMarkup = () => {
  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>`
  );
};

const renderTypeItem = (type) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.name}">
      <label class="event__type-label  event__type-label--${type.name}" for="event-type-${type.name}-1">${type.name}</label>
    </div>`
  );
};

const renderOption = (option, currentEvent) => {

  const availableOptions = currentEvent.options.map((item) => item.name);
  const isChecked = (availableOptions.includes(option.name)) ? `checked` : ``;

  return (`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-l${option.name}-1" type="checkbox" name="event-offer-${option.name}" ${isChecked}>
        <label class="event__offer-label" for="event-offer-${option.name}-1">
          <span class="event__offer-title">${option.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
        </label>
      </div>
  `);
};

const createPointEditTemplate = (point) => {
  const {type, city, startTime, endTime, price} = point;
  const cities = getCities();


  const favoritesButton = createButtonMarkup(`favorites`, !point.isFavorite);

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.img}" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                  ${Types.filter((item) => item.type === `transfer` && item.name !== type.name).map((item) => renderTypeItem(item))}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                  ${Types.filter((item) => item.type === `activity` && item.name !== type.name).map((item) => renderTypeItem(item))}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__${type.name}" for="event-destination-1">
              ${name}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${cities.map((item) => `<option value="${item.name}"></option>`)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime.format(`DD/MM/YY hh:mm`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime.format(`DD/MM/YY hh:mm`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          ${favoritesButton}

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${Options.filter((option) => option.type === type.name).map((option) => renderOption(option, point)).join(`\n`)}
            </div>
          </section>
          <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${city.description}</p>

                <div class="event__photos-container">
                  <div class="event__photos-tape">
                  </div>
                </div>
              </section>
        </section>
      </form>
    </li>`
  );
};

export default class PointEdit extends AbstractSmartComponent {
  constructor(point) {
    super();

    this._point = point;

    this._flatpickr = null;
    this._submitHandler = null;

    this._applyFlatpickr();

  }

  getTemplate() {
    return createPointEditTemplate(this._point);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  selectTypeHandler(handler) {
    this._selectTypeHandler = handler;
    const radioButtons = this.getElement().querySelectorAll(`.event__type-input`);
    radioButtons.forEach((button) => {
      button.addEventListener(`change`, handler);
    });
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate || `today`,
      });
    }
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);
  }
}
