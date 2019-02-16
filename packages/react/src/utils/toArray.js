const toArray = (value) => {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

export default toArray;
