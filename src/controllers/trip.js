import SortComponent from "../components/sort.js";
import NoPointsComponent from "../components/no-points.js";
import DaysComponent from "../components/days.js";
import PointController from "./point.js";
import FormEventComponent from "../components/form-event.js";
import TripDaysComponent from "../components/trip-days.js";
import {render, RenderPosition} from "../utils/render.js";

const SHOWING_POINTS_COUNT_ON_START = 5;

const renderPoints = (pointListElement, points, onDataChange, onViewChange) => {
  return points.map((point) => {
    const pointController = new PointController(pointListElement, onDataChange, onViewChange);

    pointController.render(point);

    return pointController;
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._points = [];
    this._showedPointControllers = [];
    this._showingPointsCount = SHOWING_POINTS_COUNT_ON_START;
    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._formEventComponent = new FormEventComponent();
    this._daysComponent = new DaysComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(points) {
    this._points = points;

    const container = this._container;

    if (this._points.length === 0) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);
    const tripDaysElement = container.querySelector(`.trip-days`);

    render(tripDaysElement, this._tripDaysComponent, RenderPosition.BEFOREEND);
    const pointListElement = container.querySelector(`.trip-events__list`);

    const newPoints = renderPoints(pointListElement, this._points.slice(0, this._showingPointsCount), this._onDataChange, this._onViewChange);
    this._showedPointControllers = this._showedPointControllers.concat(newPoints);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._points.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));

    pointController.render(this._points[index]);
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

}
