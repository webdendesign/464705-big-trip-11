import AbstractComponent from "./abstract-component.js";
import moment from 'moment';

export default class Day extends AbstractComponent {

  constructor(day = null) {
    super();
    this._day = day;
  }

  get points() {
    return this._day.points;
  }

  getTemplate() {
    return (this._day === null) ? this.renderEmptyDay() : this.renderDay();
  }

  renderDay() {
    const {date} = this._day;
    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${this._day.counter}</span>
          <time class="day__date" datetime="2019-03-18">${moment(date).format(`MMM DD`)}</time>
        </div>
        <ul class="trip-events__list">
        </ul>
      </li>`
    );
  }

  renderEmptyDay() {
    return (
      `<li class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list"></ul>
      </li>`
    );
  }

  getEventsContainer() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
