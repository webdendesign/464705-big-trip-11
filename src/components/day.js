import AbstractComponent from "./abstract-component.js";

const createDayTemplate = () => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="2019-03-18">MAR 18</time>
      </div>

      <ul class="trip-events__list">

      </ul>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(day = null) {
    super();
    this._day = day;
  }

  get points() {
    return this._day.points;
  }

  getTemplate() {
    return createDayTemplate((this._day === null) ? this.renderEmptyDay() : this.renderDay());
  }

  renderDay() {
    const {date} = this._day;
    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${date.format(`D`)}</span>
          <time class="day__date" datetime="2019-03-18">${date.format(`MMM YY`)}</time>
        </div>
        <ul class="trip-events__list"></ul>
      </li>`
    );
  }

  renderEmptyDay() {
    return (
      `<li class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list">
        </ul>
      </li>`
    );
  }

  getEventsContainer() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
