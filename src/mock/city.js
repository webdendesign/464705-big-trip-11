import {DEFAULT_TEXT} from './data/text';
import {getRandomInt} from '../utils/render';

const getRandomDescriprion = (someText) => {
  const sentences = someText.split(`.`);
  const finalString = [];
  const count = getRandomInt(1, 3);
  for (let i = 0; i <= count; i++) {
    finalString.push(sentences[getRandomInt(0, sentences.length)]);
  }
  return finalString.join(`.`);
};

const generateImages = (count) => {
  return new Array(count)
    .fill(``)
    .map(() => `http://picsum.photos/300/150?r=${Math.random()}`);
};

export const getCities = () => {
  return [
    {
      name: `Bangkok`,
      description: getRandomDescriprion(DEFAULT_TEXT),
      images: generateImages(5)
    },
    {
      name: `Kuala-Lumpur`,
      description: getRandomDescriprion(DEFAULT_TEXT),
      images: generateImages(5)
    },
    {
      name: `Tokio`,
      description: getRandomDescriprion(DEFAULT_TEXT),
      images: generateImages(5)
    },
    {
      name: `Seul`,
      description: getRandomDescriprion(DEFAULT_TEXT),
      images: generateImages(5)
    },
    {
      name: `Denpasar`,
      description: getRandomDescriprion(DEFAULT_TEXT),
      images: generateImages(5)
    },
    {
      name: `Moscow`,
      description: getRandomDescriprion(DEFAULT_TEXT),
      images: generateImages(5)
    },
    {
      name: `London`,
      description: getRandomDescriprion(DEFAULT_TEXT),
      images: generateImages(5)
    }
  ];
};
