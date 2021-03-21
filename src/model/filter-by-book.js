export const filterDataByBook = (data, book) => {
  if (!data || !data.length) return [];
  if (!book) return data;
  const filtered = [...data];
  return filtered.filter(i => {
    return i.book_id === book;
  });
};
