import AbstractComponent from "./abstract-component.js";

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
    // TODO : redner dashes depending om point quantity
    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">${startPoint.city.name} &mdash; ... &mdash; ${finalPoint.city.name}</h1>
        <p class="trip-info__dates">${startPoint.startTime.format(`D MMM`)}&nbsp;&mdash;&nbsp; ${finalPoint.finishTime.format(`D MMM`)}</p>
      </div>`
    );
  }
}


