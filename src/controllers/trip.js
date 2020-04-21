import SortComponent from "../components/sort.js";
import NoPointsComponent from "../components/no-points.js";
import DaysComponent from "../components/days.js";
import FormEventComponent from "../components/form-event.js";
import TripDaysComponent from "../components/trip-days.js";
import RoutePointComponent from "../components/route-point.js";
import RouteEditComponent from "../components/route-edit.js";
import {render, replace, RenderPosition} from "../utils/render.js";

const SHOWING_ROUTE_COUNT_ON_START = 5;

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
    const container = this._container;

    render(container, this._noPointsComponent, RenderPosition.BEFOREEND);

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._daysComponent, RenderPosition.BEFOREEND);
    const tripDaysElement = container.querySelector(`.trip-days`);

    render(tripDaysElement, this._tripDaysComponent, RenderPosition.BEFOREEND);
    const pointListElement = container.querySelector(`.trip-events__list`);

    let showingPointCount = SHOWING_ROUTE_COUNT_ON_START;
    routes.slice(1, showingPointCount)
      .forEach((route) => {
        renderPoint(pointListElement, route);
      });
  }
}
