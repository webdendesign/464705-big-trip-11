import {generatePoints, getTotalPrice} from './mocks/point.js';
import {render, RenderPosition} from './utils/render.js';
import SiteMenu, {MenuItem} from './components/site-menu.js';
import Total from './components/total.js';
import RouteInformation from './components/route-information.js';
import NoPoints from './components/no-points.js';
import TripController from './controllers/trip.js';
import PointModel from './models/points.js';
import FilterController from './controllers/filter.js';
import TripBoard from './components/trip-board.js';

const points = generatePoints(5);

const model = new PointModel(points);
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

const controller = new TripController(tripBoard, model);

if (points.length === 0) {

  render(trip, new Total(0).getElement(), RenderPosition.BEFOREEND);
  render(trips, new NoPoints().getElement(), RenderPosition.AFTERNODE);

} else {
  const total = getTotalPrice(points);

  render(trip, new RouteInformation(points).getElement(), RenderPosition.BEFOREEND);
  render(trip, new Total(total).getElement(), RenderPosition.BEFOREEND);

  controller.renderLayout();
}

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
