import TripController from "./controllers/trip.js";
import RouteInformationComponent from "./components/route-information.js";
import SiteMenuComponent from "./components/site-menu.js";
import FilterComponent from "./components/filter.js";
import {generatePoints} from "./mock/point.js";
import {generateFilters} from "./mock/filter.js";
import {render, RenderPosition} from "./utils/render.js";

const ROUTE_COUNT = 15;

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMain = pageHeaderElement.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const filters = generateFilters();
const routes = generatePoints(ROUTE_COUNT);

render(tripMain, new RouteInformationComponent(), RenderPosition.AFTERBEGIN);
render(tripControls, new SiteMenuComponent(), RenderPosition.BEFOREEND);
render(tripControls, new FilterComponent(filters), RenderPosition.BEFOREEND);

const sitePageMainElement = document.querySelector(`.page-main`);
const tripEvents = sitePageMainElement.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents);

tripController.render(routes);
