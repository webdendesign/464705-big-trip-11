import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {Types} from '../mock/data/types';
import {Activities} from '../mock/data/activities';


const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._prevousEvent = null;
    this._currentEvent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _commitChanges() {
    this._onDataChange(this, this._currentEvent, Object.assign({}, this._currentEvent, this._pointEditComponent.getState()));
  }

  render(point) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point);

    this._pointComponent.setEditButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
    });

    this._pointEditComponent.selectTypeHandler((evt) => {
      this._pointEditComponent._type = Types.find((x) => x.name === evt.target.value);
      this._pointEditComponent._name = Activities.get(this._pointEditComponent._type.name);
      this._commitChanges();
    });

    this._pointEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    if (oldPointEditComponent && oldPointComponent) {
      replace(this._pointComponent, oldPointComponent);
      replace(this._pointEditComponent, oldPointEditComponent);
    } else {
      render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._pointEditComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
