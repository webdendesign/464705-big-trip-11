import {calculateDuration, calculateDurationMs, generatePlaceholder} from '../utils/render.js';
import {types} from '../const.js';

export default class PointModel {
  constructor(data) {
    this.id = data[`id`];
    this.name = generatePlaceholder(data[`type`]);
    this.type = {
      name: data[`type`],
      img: `${data[`type`]}.png`,
      type: types.get(data[`type`])
    };
    this.city = data[`destination`];
    this.options = data[`offers`];
    this.startTime = new Date(data[`date_from`]);
    this.finishTime = new Date(data[`date_to`]);
    this.duration = calculateDuration(this.startTime, this.finishTime);
    this.durationInMs = calculateDurationMs(this.startTime, this.finishTime);
    this.price = data[`base_price`];
    this.favorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    const type = this.type.name;
    return {
      'id': this.id,
      'type': type,
      'date_from': this.startTime.toISOString(),
      'date_to': this.finishTime.toISOString(),
      'destination': this.city,
      'base_price': Number(this.price),
      'is_favorite': this.favorite,
      'offers': this.options,
    };
  }

  static parsePoint(data) {
    return new PointModel(data);
  }

  static parsePoints(data) {
    return data.map(PointModel.parsePoint);
  }

  static clone(data) {
    return new PointModel(data.toRAW());
  }
}
