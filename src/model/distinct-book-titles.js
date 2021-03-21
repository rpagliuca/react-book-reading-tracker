export const bookTitlesFromData = data => {
  const titleMap = data.reduce((acc, i) => {
    acc[i.book_id] = true;
    return acc;
  }, {});
  const titles = [];
  let prop;
  for (prop in titleMap) {
    titles.push(prop);
  }
  return sort(titles);
};

const sort = data => {
  if (!data || data.length === 0) {
    return data;
  }
  const sorted = [...data].sort((a, b) => {
    if (a < b) {
      return -1;
    }
    return 1;
  });
  return sorted;
};
