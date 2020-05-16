export const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const prepositions = new Map()
  .set(`transfer`, `to`)
  .set(`activity`, `in`);

export const types = new Map()
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
