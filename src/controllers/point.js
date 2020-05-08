import PointEdit from '../components/point-edit.js';
import Point from '../components/point.js';
import {render, RenderPosition, replaceWith, replace, remove} from '../utils/render.js';
import {Types} from '../mocks/data/types.js';
import {getCities} from '../mocks/city.js';
import {Activities} from '../mocks/data/activities.js';
import moment from 'moment';

export const Mode = {
  ADD: `add`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  name: ``,
  city: {
    name: ``,
    description: ``,
    images: []
  },
  type: Types[0],
  options: [],
  startTime: moment(),
  finishTime: moment(),
  duration: null,
  durationInMs: null,
  price: 0,
  favorite: false,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, rerenderEvents) {
    this._container = container;
    this._eventForm = null;
    this._eventCard = null;
    this._onDataChange = onDataChange;
    this._mode = Mode.DEFAULT;
    this._onViewChange = onViewChange;
    this._currentEvent = null;
    this._rerenderEvents = rerenderEvents;
  }

  setDefaultView() {
    if (this._mode === Mode.EDIT) {
      this.replaceWithCard();
      this._mode = Mode.DEFAULT;
    }
    if (this._mode === Mode.ADD) {
      this.destroy();
    }
  }

  destroy() {
    remove(this._eventForm);
    remove(this._eventCard);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _commitChanges() {
    this._onDataChange(this, this._currentEvent, this._eventForm.getData());
  }

  replaceWithCard() {
    replaceWith(this._eventForm, this._eventCard);
  }

  replaceWithForm() {
    replaceWith(this._eventCard, this._eventForm);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this.replaceWithCard();
    }
  }

  render(event, mode) {

    this._mode = mode;
    this._currentEvent = event;

    const oldEventForm = this._eventForm;
    const oldEventCard = this._eventCard;
    this._eventCard = new Point(event);
    this._eventForm = new PointEdit(event);

    this._eventCard.setShowButtonHandler(() => {
      this._onViewChange();
      this.replaceWithForm();
      this._mode = Mode.EDIT;
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventForm.setCollapseHandler(() => {
      this._onViewChange();
      this.replaceWithCard();
    });

    this._eventForm.setFavouriteButtonHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {favorite: !event.favorite}));
    });

    this._eventForm.setDeleteButtonHandler(() => {
      this._onDataChange(this, event, null);
    });

    this._eventForm.selectTypeHandler((evt) => {
      this._eventForm._type = Types.find((x) => x.name === evt.target.value);
      this._eventForm._name = Activities.get(this._eventForm._type.name);
    });

    this._eventForm.setOnSelectChange((evt) => {
      this._eventForm._city = getCities().find((x) => x.name === evt.target.value);
    });

    this._eventForm.setStartTimeHandler((evt) => {
      this._eventForm._startTime = moment(evt.target.value, `DD/MM/YYYY hh:mm`);
    });

    this._eventForm.setFinishTimeHandler((evt) => {
      this._eventForm._finishTime = moment(evt.target.value, `DD/MM/YYYY hh:mm`);
    });

    this._eventForm.setSubmitHandler(() => {
      this._commitChanges();
      this.replaceWithCard();
      this._rerenderEvents();
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventForm && oldEventCard) {
          replace(this._eventForm, oldEventForm);
          replace(this._eventCard, oldEventCard);
        } else {
          render(this._container.getEventsContainer(), this._eventCard.getElement(), RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADD:
        if (oldEventForm && oldEventCard) {
          remove(oldEventCard);
          remove(oldEventForm);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        this._onViewChange();
        render(this._container.getEventsContainer(), this._eventForm.getElement(), RenderPosition.AFTERBEGIN);
        break;
    }
  }
}
