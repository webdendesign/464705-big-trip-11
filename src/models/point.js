import moment from 'moment';
import {calculateDuration, calculateDurationMs} from '../utils/render.js';

const Activities = new Map()
  .set(`taxi`, `Take a taxi`)
  .set(`bus`, `Bus journey`)
  .set(`train`, `Take a train`)
  .set(`flight`, `Flight to`)
  .set(`ship`, `Cruise`)
  .set(`transport`, `Take a riksha`)
  .set(`drive`, `Rent a car`)
  .set(`check-in`, `Check in`)
  .set(`sightseeing`, `See sightseeing`)
  .set(`restaurant`, `Reserve a table in restaurant`);

const Types = new Map()
  .set(`taxi`, `transfer`)
  .set(`bus`, `transfer`)
  .set(`train`, `transfer`)
  .set(`flight`, `transfer`)
  .set(`ship`, `transfer`)
  .set(`transport`, `transfer`)
  .set(`drive`, `transfer`)
  .set(`check-in`, `activity`)
  .set(`sightseeing`, `activity`)
  .set(`restaurant`, `activity`);

export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.name = Activities.get(data[`type`]);
    this.type = {
      name: data[`type`],
      img: `${data[`type`]}.png`,
      type: Types.get(data[`type`])
    };
    this.city = data[`destination`];
    this.options = data[`offers`];
    this.startTime = moment(data[`date_from`]);
    this.finishTime = moment(data[`date_to`]);
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
      'date_from': this.startTime,
      'date_to': this.finishTime,
      'destination': this.city,
      'base_price': Number(this.price),
      'is_favorite': this.favorite,
      'offers': this.options,
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
