import {render as domRender, RenderPosition, replace} from '../utils/render.js';
import Filter from '../components/filter.js';
import {FilterType} from '../const.js';
export default class FilterController {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        isChecked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new Filter(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      domRender(this._container, this._filterComponent.getElement(), RenderPosition.AFTERNODE);
    }
  }

  _onFilterChange(filterType) {
    this._model.setFilter(filterType);
    this._activeFilterType = filterType;
    this._onDataChange();
  }

  _onDataChange() {
    this.render();
  }
}
