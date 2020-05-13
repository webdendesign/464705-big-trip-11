import {FilterType} from '../const';
import moment from 'moment';

export default class PointModel {
  constructor() {
    this._points = [];
    this._activeFilterType = FilterType.ALL;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getPoints() {
    return this._getFilteredPoints();
  }

  setPoints(points) {
    this._points = Array.from(points);
  }

  _getFilteredPoints() {
    const nowDate = moment();
    switch (this._activeFilterType) {
      case FilterType.ALL:
        return this._points;
      case FilterType.FUTURE:
        return this._points.filter((item) => item.startTime > nowDate);
      case FilterType.PAST:
        return this._points.filter((item) => item.startTime < nowDate);
    }
    return this._points;
  }

  getPointsAll() {
    return this._points;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removePoint(id) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addPoint(point) {
    this._points = [].concat(point, this._points);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
