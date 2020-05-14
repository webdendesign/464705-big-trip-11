import API from "./api.js";
import {render, RenderPosition, getTotalPrice} from './utils/render.js';
import SiteMenu, {MenuItem} from './components/site-menu.js';
import Total from './components/total.js';
import RouteInformation from './components/route-information.js';
import NoPoints from './components/no-points.js';
import TripController from './controllers/trip.js';
import PointModel from './models/points.js';
import FilterController from './controllers/filter.js';
import TripBoard from './components/trip-board.js';
import {AUTHORIZATION, END_POINT} from './utils';

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

const api = new API(END_POINT, AUTHORIZATION);
const model = new PointModel();
const btnNew = document.querySelector(`.trip-main__event-add-btn`);
const [menuTitle, filterTitle] = document.querySelector(`.trip-controls`).children;
const trip = document.querySelector(`.trip-info`);
const body = document.querySelector(`.page-body_main`);
const trips = document.querySelector(`.trip-events`);
const tripBoard = new TripBoard();
const appMenu = new SiteMenu();

render(menuTitle, appMenu.getElement(), RenderPosition.AFTERNODE);
render(body, tripBoard.getElement(), RenderPosition.BEFOREEND);

const filterController = new FilterController(filterTitle, model);
filterController.render();

const controller = new TripController(tripBoard, model, api);

appMenu.setOnClick((item) => {
  switch (item) {
    case MenuItem.STAT:
      controller.hide();
      break;
    case MenuItem.TABLE:
      controller.show();
      break;
  }
});

btnNew.addEventListener(`click`, () => {
  controller.show();
  controller.createPoint();
});

Promise.all([
  api.getPoints(),
  api.getOffers(),
  api.getDestinations()
]).then((res) => {
  const points = res[0];
  controller.setOptions(res[1]);
  controller.setCities(res[2]);
  model.setPoints(points);

  if (points[0].length === 0) {
    render(trip, new Total(0).getElement(), RenderPosition.BEFOREEND);
    render(trips, new NoPoints().getElement(), RenderPosition.AFTERNODE);
  } else {
    const total = getTotalPrice(points);
    render(trip, new RouteInformation(points).getElement(), RenderPosition.BEFOREEND);
    render(trip, new Total(total).getElement(), RenderPosition.BEFOREEND);
    controller.renderLayout();
  }
});
