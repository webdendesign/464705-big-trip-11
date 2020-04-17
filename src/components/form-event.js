import {createElement} from "../utils.js";

const createTransferMarkup = (movements) => {
  return movements.map((movement) => {
    return (
      `<div class="event__type-item">
        <input id="event-type-${movement}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${movement}">
        <label class="event__type-label  event__type-label--${movement}" for="event-type-${movement}-1">${movement}</label>
      </div>`
    );
  }).join(`\n`);
};

const createActivityMarkup = (activities) => {
  return activities.map((activity) => {
    return (
      `<div class="event__type-item">
      <input id="event-type-${activity}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${activity}">
      <label class="event__type-label  event__type-label--${activity}" for="event-type-${activity}-1">${activity}</label>
    </div>`
    );
  }).join(`\n`);
};

const createOfferMarkup = (titles, price) => {
  return titles.map((title) => {
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createPhotoMarkup = (photos) => {
  return photos.map((photo) => {
    return (
      `<img class="event__photo" src="${photo}" alt="Event photo">`
    );
  }).join(`\n`);
};

const createFormEventTemplate = (routePoint) => {
  const {movement, activity, sity, offerTitle, offerPrice, description, photos} = routePoint;

  const drive = `Taxi to`;
  const startTime = `18/03/19 00:00`;
  const endTime = `18/03/19 00:00`;
  const price = `60`;

  const transferMarkup = createTransferMarkup(movement);
  const activityMarkup = createActivityMarkup(activity);
  const offerMarkup = createOfferMarkup(offerTitle, offerPrice);
  const photoMarkup = createPhotoMarkup(photos);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transferMarkup}
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${drive}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${sity} list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
            <option value="Saint Petersburg"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offerMarkup}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photoMarkup}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

export default class FormEvent {
  constructor(routePoint) {
    this._routePoint = routePoint;
    this._element = null;
  }

  getTemplate() {
    return createFormEventTemplate(this._routePoint);
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
