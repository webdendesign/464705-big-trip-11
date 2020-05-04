import AbstractComponent from "./abstract-component.js";

const createTripEventsTemplate = () => {
  return (
    `<ul class="trip-events__list">`
  );
};


export default class TripEvents extends AbstractComponent {
  getTemplate() {
    return createTripEventsTemplate();
  }
}
