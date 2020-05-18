import API from "./api/index.js";
import Store from './api/store.js';
import Provider from './api/provider.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import RouteController from './controllers/route.js';
import TotalController from './controllers/total.js';
import NoPointsComponent from './components/no-points.js';
import TripController from './controllers/trip.js';
import FilterController from './controllers/filter.js';
import TripBoardComponent from './components/trip-board.js';
import {AUTHORIZATION, END_POINT} from './utils.js';
import StatisticsComponent from './components/statistics.js';
import PointsModel from './models/points.js';
import {render, RenderPosition} from './utils/render.js';

if (`serviceWorker` in navigator) {
  window.addEventListener(`load`, () => {
    navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
        // Действие, в случае успешной регистрации ServiceWorker
      }).catch(() => {
        // Действие, в случае ошибки при регистрации ServiceWorker
      });
  });
}

const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const model = new PointsModel();
const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const btnNew = document.querySelector(`.trip-main__event-add-btn`);
const [menuTitle, filterTitle] = document.querySelector(`.trip-controls`).children;
const trip = document.querySelector(`.trip-info`);
const body = document.querySelector(`.page-body_main`);
const trips = document.querySelector(`.trip-events`);
const tripBoard = new TripBoardComponent();
const statistics = new StatisticsComponent(model);
const appMenu = new SiteMenuComponent();

render(menuTitle, appMenu.getElement(), RenderPosition.AFTERNODE);
render(body, tripBoard.getElement(), RenderPosition.BEFOREEND);
render(body, statistics.getElement(), RenderPosition.BEFOREEND);
statistics.hide();

const filterController = new FilterController(filterTitle, model);
const tripController = new TripController(tripBoard, model, apiWithProvider);
const detailsController = new RouteController(trip, model);
const totalController = new TotalController(trip, model);

appMenu.setOnClick((item) => {
  switch (item) {
    case MenuItem.STAT:
      tripController.hide();
      statistics.show();
      break;
    case MenuItem.TABLE:
      statistics.hide();
      tripController.show();
      break;
  }
});

btnNew.addEventListener(`click`, () => {
  tripController.show();
  tripController.createPoint();
});

Promise.all([
  apiWithProvider.getPoints(),
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations()
]).then((res) => {
  const [points, options, cities] = res;
  tripController.setOptions(options);
  tripController.setCities(cities);
  model.setPoints(points);
  filterController.render();
  if (points[0].length === 0) {
    totalController.render();
    render(trips, new NoPointsComponent().getElement(), RenderPosition.AFTERNODE);
  } else {
    detailsController.render();
    totalController.render();
    tripController.renderLayout();
  }
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then(() => {
        // Действие, в случае успешной синхронизации
      })
      .catch(() => {
        // Действие, в случае ошибки синхронизации
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
