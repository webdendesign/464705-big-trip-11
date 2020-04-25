import SortComponent, {SortType} from "../components/sort.js";
import NoPointsComponent from "../components/no-points.js";
import DaysComponent from "../components/days.js";
import FormEventComponent from "../components/form-event.js";
import TripDaysComponent from "../components/trip-days.js";
import RoutePointComponent from "../components/route-point.js";
import RouteEditComponent from "../components/route-edit.js";
import {render, replace, RenderPosition} from "../utils/render.js";

const SHOWING_ROUTE_COUNT_ON_START = 10;
const SHOWING_TASKS_COUNT_BY_BUTTON = 10;

const renderPoint = (pointListElement, route) => {
  const replacePointToEdit = () => {
    replace(routeEditComponent, routeComponent);
  };

  const replaceEditToPoint = () => {
    replace(routeComponent, routeEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const routeComponent = new RoutePointComponent(route);
  const routeEditComponent = new RouteEditComponent(route);

  routeComponent.setEditButtonClickHandler(() => {
    replacePointToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  routeEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(pointListElement, routeComponent, RenderPosition.BEFOREEND);
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._formEventComponent = new FormEventComponent();
    this._daysComponent = new DaysComponent();
    this._tripDaysComponent = new TripDaysComponent();
  }

  render(routes) {
    this._routes = routes;

    const container = this._container;

    if (this._routes.length === 0) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);
    const tripDaysElement = container.querySelector(`.trip-days`);

    render(tripDaysElement, this._tripDaysComponent, RenderPosition.BEFOREEND);
    const pointListElement = container.querySelector(`.trip-events__list`);

    let showingRouteCount = SHOWING_ROUTE_COUNT_ON_START;

    routes.slice(0, showingRouteCount)
      .forEach((route) => {
        renderPoint(pointListElement, route);
      });

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingRouteCount = SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedRoutes = getSortedTasks(routes, sortType, 0, showingRouteCount);

      pointListElement.innerHTML = ``;

      sortedRoutes.slice(0, showingRouteCount)
        .forEach((task) => {
          renderPoint(pointListElement, task);
        });

    });
  }
}
