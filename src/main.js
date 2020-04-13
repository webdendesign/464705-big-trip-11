import {createRouteInformationTemplate} from './components/route-information';
import {createSiteMenuTemplate} from './components/site-menu';
import {createFilterTemplate} from './components/filter';
import {createSortTemplate} from './components/sort';
import {createFormEventTemplate} from './components/form-event';
import {createTripDaysTemplate} from './components/trip-days';
// import {createRoutePointTemplate} from './components/route-point';
import {generateRoutes} from './mock/route-point.js';
import {generateFilters} from './mock/filter.js';

const TASK_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMain = pageHeaderElement.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const sitePageMainElement = document.querySelector(`.page-main`);
const tripEvents = sitePageMainElement.querySelector(`.trip-events`);

const filters = generateFilters();
const route = generateRoutes(TASK_COUNT);

render(tripMain, createRouteInformationTemplate(), `afterBegin`);
render(tripControls, createSiteMenuTemplate(), `beforeend`);
render(tripControls, createFilterTemplate(filters), `beforeend`);

render(tripEvents, createSortTemplate(), `afterBegin`);
// render(tripEvents, createFormEventTemplate(route[0]), `beforeend`);
render(tripEvents, createTripDaysTemplate(), `beforeend`);

const tripEventsList = tripEvents.querySelector(`.trip-events__list`);

for (let i = 0; i < route.length; i++) {
  // render(tripEventsList, createRoutePointTemplate(route[i]), `beforeend`);
  render(tripEventsList, createFormEventTemplate(route[i]), `beforeend`);

}
