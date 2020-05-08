import AbstractComponent from "./abstract-component.js";

export default class Total extends AbstractComponent {

  constructor(total) {
    super();
    this._total = total;
  }

  getTemplate() {
    return (`
     <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._total}</span>
    </p>
    `);
  }
}
