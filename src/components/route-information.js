import AbstractComponent from './abstract-component.js';
import moment from 'moment';

const MAX_CITIES_COUNT = 3;
const MIDDLE_CITIES_COUNT = 2;

export default class RouteInformation extends AbstractComponent {

  constructor(points) {
    super();
    this._points = points.sort((a, b) => {
      if (a.startTime > b.startTime) {
        return 1;
      }
      if (a.startTime < b.startTime) {
        return -1;
      }
      return 0;
    });
  }

  getTemplate() {
    const startPoint = this._points[0];
    const finalPoint = this._points[this._points.length - 1];

    const startTime = moment(startPoint.startTime);
    const finishTime = moment(finalPoint.startTime);

    const cities = new Set();
    this._points.map((point) => cities.add(point.city.name));

    let title;
    if (cities.size > MAX_CITIES_COUNT) {
      title = `${startPoint.city.name} &mdash; ... &mdash; ${finalPoint.city.name}`;
    } else if (cities.size === MAX_CITIES_COUNT) {
      title = `${startPoint.city.name} &mdash; ${this._points[1].city.name} &mdash; ${finalPoint.city.name}`;
    } else if (cities.size === MIDDLE_CITIES_COUNT) {
      title = `${startPoint.city.name} &mdash; ${finalPoint.city.name}`;
    } else {
      title = `${startPoint.city.name} &mdash; ${startPoint.city.name}`;
    }
    return (`<div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>
        <p class="trip-info__dates">${startTime.format(`D MMM`)}&nbsp;&mdash;&nbsp; ${finishTime.format(`D MMM`)}</p>
      </div>`);
  }
}

