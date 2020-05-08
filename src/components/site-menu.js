import AbstractComponent from "./abstract-component.js";

export const MenuItem = {
  TABLE: `table`,
  STAT: `stat`,
};

export default class SiteMenu extends AbstractComponent {
  getTemplate() {
    return (`<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" data-name="${MenuItem.TABLE}" href="#">Table</a>
    <a class="trip-tabs__btn"  data-name="${MenuItem.STAT}" href="#">Stats</a>
  </nav>
  `);
  }

  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item) {
      item.checked = true;
    }
  }

  setOnClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const menuItem = evt.target.dataset.name;
      handler(menuItem);
    });
  }
}

