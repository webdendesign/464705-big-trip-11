import RouteInformationComponent from "./components/route-information";
import SiteMenuComponent from "./components/site-menu";
import FilterComponent from "./components/filter";
import SortComponent from "./components/sort";
import NoPointsComponent from "./components/no-points.js";
import DaysComponent from "./components/days";
import FormEventComponent from "./components/form-event";
import TripDaysComponent from "./components/trip-days";
import RoutePointComponent from "./components/route-point";
import RouteEditComponent from "./components/route-edit";
import {generateRoutes} from "./mock/route-point.js";
import {generateFilters} from "./mock/filter.js";
import {render, replace, RenderPosition} from "./utils/render.js";

const ROUTE_COUNT = 15;
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
  const editButton = routeComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    replacePointToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const routeEditComponent = new RouteEditComponent(route);
  const editForm = routeEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(pointListElement, routeComponent, RenderPosition.BEFOREEND);
};

const renderTrip = (tripEvents, routes) => {

  render(tripEvents, new NoPointsComponent(), RenderPosition.BEFOREEND);

  render(tripEvents, new SortComponent(), RenderPosition.BEFOREEND);
  render(tripEvents, new FormEventComponent(routes[0]), RenderPosition.BEFOREEND);
  render(tripEvents, new DaysComponent(), RenderPosition.BEFOREEND);
  const tripDaysElement = tripEvents.querySelector(`.trip-days`);

  render(tripDaysElement, new TripDaysComponent(), RenderPosition.BEFOREEND);
  const pointListElement = tripEvents.querySelector(`.trip-events__list`);

  let showingPointCount = SHOWING_ROUTE_COUNT_ON_START;
  routes.slice(1, showingPointCount)
    .forEach((route) => {
      renderPoint(pointListElement, route);
    });
};

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMain = pageHeaderElement.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const filters = generateFilters();
const routes = generateRoutes(ROUTE_COUNT);

render(tripMain, new RouteInformationComponent(), RenderPosition.AFTERBEGIN);
render(tripControls, new SiteMenuComponent(), RenderPosition.BEFOREEND);
render(tripControls, new FilterComponent(filters), RenderPosition.BEFOREEND);

const sitePageMainElement = document.querySelector(`.page-main`);
const tripEvents = sitePageMainElement.querySelector(`.trip-events`);

renderTrip(tripEvents, routes);
