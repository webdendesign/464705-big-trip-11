const generateFilters = () => {
  return [{
    period: `everything`,
  }, {
    period: `future`,
  }, {
    period: `past`
  }];
};

export {generateFilters};
