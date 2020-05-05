import SortComponent, {SortType} from "../components/sort.js";
import NoPointsComponent from "../components/no-points.js";
import DayComponent from "../components/day.js";
import PointController from "./point.js";
import FormEventComponent from "../components/form-event.js";
import TripDaysComponent from "../components/trip-days.js";
import TripEventsComponent from "../components/trip-events.js";
import {render, RenderPosition} from "../utils/render.js";

const SHOWING_POINTS_COUNT_ON_START = 18;
// const SHOWING_TASKS_COUNT_BY_BUTTON = 10;

const renderPoints = (pointListElement, points, onDataChange, onViewChange) => {
  return points.map((point) => {
    const pointController = new PointController(pointListElement, onDataChange, onViewChange);

    pointController.render(point);

    return pointController;
  });
};

const getSortedPoints = (points, sortType, from, to) => {
  let sortedPoints = [];
  const showingPoints = points.slice();

  switch (sortType) {
    case SortType.TIME:
      sortedPoints = showingPoints.sort((a, b) => b.durationInMs - a.durationInMs);
      break;
    case SortType.PRICE:
      sortedPoints = showingPoints.sort((a, b) => b.price - a.price);
      break;
    case SortType.DEFAULT:
      sortedPoints = showingPoints;
      break;
  }

  return sortedPoints.slice(from, to);
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._points = [];
    this._showedPointControllers = [];
    this._showingPointsCount = SHOWING_POINTS_COUNT_ON_START;
    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._dayComponent = new DayComponent();
    this._tripEventsComponent = new TripEventsComponent();

    this._formEventComponent = new FormEventComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

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
    render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);

    render(container, this._dayComponent, RenderPosition.BEFOREEND);
    render(container, this._tripEventsComponent, RenderPosition.BEFOREEND);

    const pointListElement = this._tripEventsComponent.getElement();

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

  _onSortTypeChange(sortType) {
    this._showingPointsCount = SHOWING_POINTS_COUNT_ON_START;

    const sortedPoints = getSortedPoints(this._points, sortType, 0, this._showingPointsCount);
    const pointListElement = this._tripEventsComponent.getElement();

    pointListElement.innerHTML = ``;

    const newPoints = renderPoints(pointListElement, sortedPoints, this._onDataChange, this._onViewChange);
    this._showedPointControllers = newPoints;

  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
    //   let showingRouteCount = SHOWING_ROUTE_COUNT_ON_START;

    //   routes.slice(0, showingRouteCount)
    //     .forEach((route) => {
    //       renderPoint(pointListElement, route);
    //     });

    //   this._sortComponent.setSortTypeChangeHandler((sortType) => {
    //     showingRouteCount = SHOWING_TASKS_COUNT_BY_BUTTON;

    //     const sortedRoutes = getSortedTasks(routes, sortType, 0, showingRouteCount);

    //     pointListElement.innerHTML = ``;

    //     sortedRoutes.slice(0, showingRouteCount)
    //       .forEach((task) => {
    //         renderPoint(pointListElement, task);
    //       });

    //   });
  }

}
