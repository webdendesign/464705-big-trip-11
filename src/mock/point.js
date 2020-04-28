import {getRandomInt, getRandomDate} from '../utils/render';

import {Types} from './data/types';
import {Activities} from './data/activities';

import moment from 'moment';

const SityItems = [
  `Ansterdam`,
  `Chamonix`,
  `Sochi`,
  `Pekin`,
  `Deli`,
  `Cair`,
  `Moscow`,
  `Paris`,
  `London`,
  `Atlanta`,
  `Chicago`,
  `Tomsk`,
  `Tokyo`,
  `Dallas`,
];

const OfferTitle = [
  `Add luggage`,
  `Switch to comfort class`,
  `Add meal`,
  `Choose seats`,
  `Travel by train`,
];

const Photos = [
  `img/photos/1.jpg`,
  `img/photos/2.jpg`,
  `img/photos/3.jpg`,
  `img/photos/4.jpg`,
  `img/photos/5.jpg`,
];

const getRandomType = (types) => {
  return types[Math.floor(Math.random() * types.length)];
};

const randomType = getRandomType(Types);

const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`;

const generatePoint = () => {

  const startTimeRandom = moment(getRandomDate());
  const endTimeRandom = startTimeRandom.clone().add(getRandomInt(1, 4), `h`).add(getRandomInt(1, 60), `m`);
  const timeDifference = endTimeRandom.clone().diff(startTimeRandom);
  const eventDuration = moment.utc(moment.duration(timeDifference).asMilliseconds());
  const formattedDuration = `${eventDuration.format(`h`)}H ${eventDuration.format(`mm`)}M`;
  const randomPrice = getRandomInt(1, 500);

  return {
    name: Activities.get(randomType.name),
    type: getRandomItem(Types),
    city: getRandomItem(SityItems),
    startTime: startTimeRandom,
    endTime: endTimeRandom,
    finishTime: endTimeRandom,
    duration: formattedDuration,
    durationInMs: eventDuration,
    price: randomPrice,
    offerTitle: OfferTitle,
    description: text,
    photos: Photos,
  };
};

const generatePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePoint);
};

export {generatePoint, generatePoints};
