import {render as domRender, RenderPosition, replace, getTotalPrice} from '../utils';
import Total from '../components/total';

export default class TotalController {

  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._totalComponent = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._model.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldComponent = this._totalComponent;

    this._totalComponent = new Total(getTotalPrice(this._model.getPointsAll()));

    if (oldComponent) {
      replace(this._totalComponent, oldComponent);
    } else {
      domRender(this._container, this._totalComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }
  _onDataChange() {
    this.render();
  }
}
