import TripController from "./controllers/trip.js";
import RouteInformationComponent from "./components/route-information.js";
import SiteMenuComponent from "./components/site-menu.js";
import FilterController from "./controllers/filter.js";
import PointsModel from "./models/points.js";
import {generatePoints} from "./mock/point.js";
import {render, RenderPosition} from "./utils/render.js";

const POINT_COUNT = 15;

const pageHeaderElement = document.querySelector(`.page-header`);
const tripMain = pageHeaderElement.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const points = generatePoints(POINT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

render(tripMain, new RouteInformationComponent(), RenderPosition.AFTERBEGIN);
render(tripControls, new SiteMenuComponent(), RenderPosition.BEFOREEND);
const filterController = new FilterController(pointsModel);
filterController.render();


const sitePageMainElement = document.querySelector(`.page-main`);
const tripEvents = sitePageMainElement.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents, pointsModel);

tripController.render(points);
