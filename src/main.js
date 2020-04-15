import RouteInformationComponent from './components/route-information';
import SiteMenuComponent from './components/site-menu';
import FilterComponent from './components/filter';
import SortComponent from './components/sort';
import FormEventComponent from './components/form-event';
import TripDaysComponent from './components/trip-days';
import RoutePointComponent from './components/route-point';
import RouteEditComponent from './components/route-point';
import {generateRoutes} from './mock/route-point.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from "./utils.js";

const TASK_COUNT = 15;

const renderPoint = (taskListElement, task) => {
  const onEditButtonClick = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const taskComponent = new RoutePointComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const taskEditComponent = new RouteEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMain = pageHeaderElement.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const sitePageMainElement = document.querySelector(`.page-main`);
const tripEvents = sitePageMainElement.querySelector(`.trip-events`);

const filters = generateFilters();
const route = generateRoutes(TASK_COUNT);

render(tripMain, new RouteInformationComponent().getElement(), RenderPosition.AFTERBEGIN);
render(tripControls, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
render(tripControls, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

render(tripEvents, new SortComponent().getElement, `afterBegin`);
render(tripEvents, new FormEventComponent(route[0]).getElement, `beforeend`);
render(tripEvents, new TripDaysComponent().getElement(), `beforeend`);

const tripEventsList = tripEvents.querySelector(`.trip-events__list`);

for (let i = 1; i < route.length; i++) {
  render(tripEventsList, new RoutePointComponent(renderPoint).getElement(), `beforeend`);
}
