import {render as domRender, RenderPosition, replace} from '../utils/render.js';
import RouteInformation from '../components/route-information.js';

export default class RouteController {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._detailsComponent = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._model.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldComponent = this._detailsComponent;

    this._detailsComponent = new RouteInformation(this._model.getPointsAll());

    if (oldComponent) {
      replace(this._detailsComponent, oldComponent);
    } else {
      domRender(this._container, this._detailsComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }
  _onDataChange() {
    this.render();
  }
}
