import {getRandomInt, getRandomDate} from '../utils/render.js';
import moment from 'moment';
import {Options} from './data/options';
import {Types} from './data/types';
import {Activities} from './data/activities';
import {getCities} from '../mocks/city';

const getRandomType = (types) => {
  return types[Math.floor(Math.random() * types.length)];
};

const getRandomOptions = (type, options) => {
  const randomInt = getRandomInt(0, 4);
  const randomOptions = options.filter((item) => type.name === item.type).slice(0, getRandomInt(1, randomInt));
  return randomOptions;
};

export const getTotalPrice = (points) => {
  let sum = 0;
  for (const event of points) {
    sum += event.price;
    sum += event.options.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
  }
  return sum;
};

const getRandomCity = (cities) => {
  return cities[Math.floor(Math.random() * cities.length)];
};

export const generatePoint = () => {
  const randomType = getRandomType(Types);
  const randomOptions = getRandomOptions(randomType, Options);
  const randomPrice = getRandomInt(1, 500);
  const startTimeRandom = moment(getRandomDate());
  const finishTimeRandom = startTimeRandom.clone().add(getRandomInt(1, 4), `h`).add(getRandomInt(1, 60), `m`);
  const timeDifference = finishTimeRandom.clone().diff(startTimeRandom);
  const eventDuration = moment.utc(moment.duration(timeDifference).asMilliseconds());
  const formattedDuration = `${eventDuration.format(`h`)}H ${eventDuration.format(`mm`)}M`;
  const currentCity = getRandomCity(getCities());

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: Activities.get(randomType.name),
    city: currentCity,
    type: randomType,
    options: randomOptions,
    startTime: startTimeRandom,
    finishTime: finishTimeRandom,
    duration: formattedDuration,
    durationInMs: eventDuration,
    price: randomPrice,
    favorite: false,
  };
};

export const generatePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePoint);
};
