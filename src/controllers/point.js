import PointEdit from '../components/point-edit.js';
import Point from '../components/point.js';
import {render, RenderPosition, replaceWith, replace, remove} from '../utils/render.js';
import {Types} from '../mocks/data/types.js';
import {Activities} from '../mocks/data/activities.js';
import moment from 'moment';
import PointModels from '../models/point';

const SHAKE_ANIMATION_TIMEOUT = 600;

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
    pictures: []
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
    this._cities = [];
    this._options = [];
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
    this._eventForm = new PointEdit(event, this._cities, this._options);

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
      const newPoint = PointModels.clone(event);
      newPoint.favorite = !newPoint.favorite;
      this._onDataChange(this, event, newPoint);
    });

    this._eventForm.setDeleteButtonHandler(() => {
      this._eventForm.setData({
        deleteButtonText: `Deleting...`,
      });
      this._onDataChange(this, event, null);
    });

    this._eventForm.selectTypeHandler((evt) => {
      this._eventForm._type = Types.find((x) => x.name === evt.target.value);
      this._eventForm._name = Activities.get(this._eventForm._type.name);
    });

    this._eventForm.setOnSelectChange((evt) => {
      this._eventForm._city = this._cities.find((x) => x.name === evt.target.value);
    });

    this._eventForm.setStartTimeHandler((evt) => {
      this._eventForm._startTime = moment(evt.target.value, `DD/MM/YYYY hh:mm`);
    });

    this._eventForm.setFinishTimeHandler((evt) => {
      this._eventForm._finishTime = moment(evt.target.value, `DD/MM/YYYY hh:mm`);
    });

    this._eventForm.setPriceHandler((evt) => {
      this._eventForm.price = evt.target.value;
    });

    this._eventForm.setOfferHandler((evt) => {
      const offerTitle = evt.target.dataset.name;
      const availableTypeOffers = this._options.find((item) => item.type === this._eventForm._type.name).offers;
      const currentOffer = availableTypeOffers.find((offer) => offer.title === offerTitle);
      const existOffer = this._eventForm.offers.find(((offer) => offer.title === offerTitle));
      if (existOffer) {
        this._eventForm.offers = this._eventForm.offers.filter((item) => item.title !== currentOffer.title);
      } else {
        this._eventForm.offers.push(currentOffer);
      }
    });

    this._eventForm.setSubmitHandler(() => {
      this._eventForm.setError(0);
      this._eventForm.lock();
      this._eventForm.setData({
        saveButtonText: `Saving...`,
      });
      this._commitChanges();
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

  setCities(cities) {
    this._cities = cities;
  }

  setOptions(options) {
    this._options = options;
  }

  shake() {
    this._eventForm.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventCard.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventForm.setError(true);
    setTimeout(() => {
      this._eventForm.getElement().style.animation = ``;
      this._eventCard.getElement().style.animation = ``;
      this._eventForm.unlock();
      this._eventForm.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
