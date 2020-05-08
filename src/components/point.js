import AbstractComponent from "./abstract-component.js";

export default class Point extends AbstractComponent {

  constructor(event) {
    super();
    this._event = event;
    this._showBtnHandler = null;
    this.recoveryListeners();
  }

  setShowButtonHandler(handler) {
    this._showBtnHandler = handler;
    this.setClickHandler(`.event__rollup-btn`, handler);
  }

  recoveryListeners() {
    this.setClickHandler(`.event__rollup-btn`, this._showBtnHandler);
  }

  getTemplate() {
    const {name, city, startTime, finishTime, duration, price, options, type} = this._event;
    const cityName = city === undefined ? `` : city.name;

    return (
      `<li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type.img}" alt="Event type icon">
          </div>
          <h3 class="event__title">${name} at ${cityName}</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="2019-03-18T10:30">${startTime.format(`hh:mm`)}</time>
              &mdash;
              <time class="event__end-time" datetime="2019-03-18T11:00">${finishTime.format(`hh:mm`)}</time>
            </p>
            <p class="event__duration">${duration}</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${ options.length > 0 ? ` <li class="event__offer">
              <span class="event__offer-title">${options[0].name}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${options[0].price}</span>
            </li>` : ``}
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`);
  }
}
