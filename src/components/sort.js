import AbstractComponent from "./abstract-component.js";

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._sortType = this.sortTypes().DEFAULT;
  }

  sortTypes() {
    return {
      PRICE: `price`,
      DATE: `date`,
      DEFAULT: `default`,
    };
  }

  getTemplate() {
    return (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="" checked>
        <label class="trip-sort__btn" for="sort-event" data-sort-order="${this.sortTypes().DEFAULT}">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="">
        <label class="trip-sort__btn" for="sort-time" data-sort-order="${this.sortTypes().DATE}">
          Time
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="">
        <label class="trip-sort__btn" for="sort-price" data-sort-order="${this.sortTypes().PRICE}">
          Price
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`);
  }

  setOnClickHandler(handler) {
    this.getElement().addEventListener(`click`, (e) => {

      if (e.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = e.target.dataset.sortOrder;

      if (this._sortType === sortType) {
        return;
      }
      this._sortType = sortType;

      handler(this._sortType);
    });
  }
}
