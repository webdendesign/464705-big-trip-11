import Sorting from '../components/sort.js';
import Day from '../components/day.js';
import TripDays from '../components/trip-days.js';
import {render, RenderPosition, generateDays, remove} from '../utils/render.js';
import PointController, {Mode as ControllerMode, emptyPoint} from './point.js';


export default class TripController {

  constructor(container, model, api) {
    this._container = container;
    this._model = model;
    this._api = api;

    this._sort = new Sorting();
    this._tripDays = new TripDays();
    this._createForm = null;
    this._createFormDayElement = null;

    this._points = [];
    this._renderedControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._sortHandler = this._sortHandler.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.rerenderEvents = this.rerenderEvents.bind(this);

    this._model.setFilterChangeHandler(this._onFilterChange);
    this._sort.setOnClickHandler(this._sortHandler);
    this._currentSortType = this._sort.sortTypes().DEFAULT;

    this._cities = [];
    this._options = [];
  }

  setCities(cities) {
    this._cities = cities;
  }

  setOptions(options) {
    this._options = options;
  }

  renderLayout() {
    this._points = this._model.getPoints();
    render(this._container.getElement(), this._sort.getElement(), RenderPosition.BEFOREEND);
    render(this._container.getElement(), this._tripDays.getElement(), RenderPosition.BEFOREEND);
    this.renderEventsWithDays(this._points);
  }

  renderEventsWithoutDays(points) {
    const day = new Day();
    render(this._tripDays.getElement(), day.getElement(), RenderPosition.BEFOREEND);
    this._renderedControllers = points.map((point) => {
      const event = new PointController(day, this._onDataChange, this._onViewChange, this.rerenderEvents);
      event.setCities(this._cities);
      event.setOptions(this._options);
      event.render(point, ControllerMode.DEFAULT);
      return event;
    });
  }

  renderEventsWithDays(points) {
    const daysEvents = generateDays(points, this._model.orderByDate()[0].startTime);
    const daysElements = [];
    const days = this._tripDays.getElement();

    daysEvents.map((item) => {
      const day = new Day(item);
      daysElements.push(day);
      render(days, day.getElement(), RenderPosition.BEFOREEND);
    });
    this._renderedControllers = [];
    daysElements.map((element) => {
      element.points.map((point) => {
        const event = new PointController(element, this._onDataChange, this._onViewChange, this.rerenderEvents);
        event.setCities(this._cities);
        event.setOptions(this._options);
        event.render(point, ControllerMode.DEFAULT);
        this._renderedControllers.push(event);
      });
    });
  }

  destroyCreatingForm() {
    if (this._createForm) {
      this._createForm.destroy();
      this._createForm = null;
      remove(this._createFormDayElement);
    }
    this._renderedControllers = this._renderedControllers.filter((controller) => controller.getMode() !== ControllerMode.ADD);
  }

  createPoint() {
    this.destroyCreatingForm();
    this._createFormDayElement = new Day();
    render(this._tripDays.getElement(), this._createFormDayElement.getElement(), RenderPosition.AFTERBEGIN);
    this._createForm = new PointController(this._createFormDayElement, this._onDataChange, this._onViewChange, this.rerenderEvents);
    this._createForm.setCities(this._cities);
    this._createForm.setOptions(this._options);
    this._createForm.render(emptyPoint, ControllerMode.ADD);
    this._renderedControllers = [].concat(this._createForm, this._renderedControllers);
  }

  rerenderEvents() {
    this._updatePoints();
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  _updatePoints() {
    this._tripDays.clearElement();
    this._removePoints();
    this._sortHandler(this._currentSortType);
  }

  _removePoints() {
    this._renderedControllers.forEach((controller) => controller.destroy());
    this._renderedControllers = [];
  }

  _onDataChange(controller, oldObject, newObject, needRerender = true) {
    if (oldObject === emptyPoint) {
      if (newObject === null) {
        controller.destroy();
        this._updatePoints();
      } else {
        this._api.createPoint(newObject).then((newPoint) => {
          this._model.addPoint(newPoint);
          controller.render(newPoint, ControllerMode.DEFAULT);
          const destroyedPoint = this._renderedControllers.pop();
          destroyedPoint.destroy();
          this._renderedControllers = [].concat(controller, this._renderedControllers);
          this._updatePoints();
        }).catch(() => {
          controller.shake();
        });
      }
      return;
    }

    if (newObject === null) {
      this._api.deletePoint(oldObject.id)
        .then(() => {
          this._model.removePoint(oldObject.id);
          this._updatePoints();
        })
        .catch(() => {
          controller.shake();
        });
      return;
    }

    this._api.updatePoint(oldObject.id, newObject)
      .then((pointModel) => {
        const isSuccess = this._model.updatePoint(oldObject.id, pointModel);
        if (isSuccess && needRerender) {
          controller.render(pointModel, ControllerMode.DEFAULT);
          this._updatePoints();
        }
      })
      .catch(() => {
        controller.shake();
      });

  }

  _onViewChange() {
    this._renderedControllers.forEach((controller) => controller.setDefaultView());
  }

  _sortHandler(sortType) {
    this._currentSortType = sortType;
    const sortTypes = this._sort.sortTypes;
    const points = this._model.getPoints();
    this._tripDays.clearElement();
    switch (sortType) {
      case sortTypes().DEFAULT:
        this.renderEventsWithDays(points);
        break;
      case sortTypes().PRICE:
        this.renderEventsWithoutDays(points.sort((a, b) => b.price - a.price));
        break;
      case sortTypes().DATE:
        this.renderEventsWithoutDays(points.sort((a, b) => b.durationInMs - a.durationInMs));
        break;
    }
  }

  _onFilterChange() {
    this._updatePoints();
  }
}
