const ChooseMovement = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
];

const ActivityMovement = [
  `check-in`,
  `sightseeing`,
  `restaurant`,
];


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

const getRandomSityItem = (arraySity) => {
  return arraySity[Math.floor(Math.random() * arraySity.length)];
};

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`;

const generateRoute = () => {

  return {
    movement: ChooseMovement,
    activity: ActivityMovement,
    sity: getRandomSityItem(SityItems),
    offerTitle: OfferTitle,
    offerPrice: `40`,
    description: text,
    photos: Photos,
  };
};

const generateRoutes = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateRoute);
};

export {generateRoute, generateRoutes};
