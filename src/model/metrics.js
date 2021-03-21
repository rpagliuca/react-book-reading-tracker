export const accumulatedPerDate = (rawData, dateMax) => {
  rawData = sortAndFilter(rawData);
  const data = rawData.reduce((acc, i) => {

    let total = 0;

    if (acc.length > 0) {
      total = acc[acc.length-1].y;
    }

    let shouldRepeat;
    do {
      shouldRepeat = false;
      if (date(i.start_time) > date(dateMax)) {
        // Skip
      } else if (acc.length === 0) {
        // Initial date
        acc.push({x: date(i.start_time), y: total + i.end_location - i.start_location});
      } else if (date(acc[acc.length-1].x) === date(i.start_time)) {
        // Same date as previous
        acc[acc.length-1].y += i.end_location - i.start_location;
      } else if (datePlus1(acc[acc.length-1].x) === date(i.start_time)) {
        // Day + 1
        acc.push({x: date(i.start_time), y: total + i.end_location - i.start_location});
      } else {
        // Add day with no records
        acc.push({x: datePlus1(acc[acc.length-1].x), y: total})
        shouldRepeat = true;
      }
    } while (shouldRepeat);

    return acc
  }, []);

  while (date(data[data.length-1].x) < date(dateMax)) {
    data.push({x: datePlus1(data[data.length-1].x), y: data[data.length-1].y});
  }

  return data;
}

export const datePlus1 = dateStr => {
  if (dateStr.length === 10) {
    dateStr += "T00:00:00";
  }
  const timestamp = Date.parse(dateStr);
  if (timestamp) {
    const date = new Date();
    date.setTime(timestamp);

    date.setDate(date.getDate() + 1)

    const formatted = date.getFullYear()
      + "-" + pad((date.getMonth()+1), 2)
      + "-" + pad(date.getDate(), 2)
    ;

    return formatted;
  }
  return "";
}

const date = dateStr => {
  if (dateStr.length === 10) {
    dateStr += "T00:00:00";
  }
  const timestamp = Date.parse(dateStr);
  if (timestamp) {
    const date = new Date();
    date.setTime(timestamp);
    return formatDate(date);
  }
  return "";
}

export const formatDate = date => {
    const formatted = date.getFullYear()
      + "-" + pad((date.getMonth()+1), 2)
      + "-" + pad(date.getDate(), 2)
    ;
    return formatted;
}

export const sortAndFilter = data => {
  if (!data || data.length === 0) {
    return data;
  }
  const sorted = [...data].sort((a, b) => {
    if (a.start_time < b.start_time) {
      return -1;
    }
    return 1;
  });
  const filtered = sorted.filter(i => {
    return i.start_time && i.end_time && i.start_location && i.end_location;
  });
  return filtered;
};

const pad = (num, len) => {
    var str = num + "";
    while (str.length < len) {
        str = "0" + str;
    }
    return str;
}

export const newPagesPerDate = (rawData, dateMax) => {
  rawData = sortAndFilter(rawData);
  const data = rawData.reduce((acc, i) => {
    let shouldRepeat;
    do {
      shouldRepeat = false;
      if (date(i.start_time) > date(dateMax)) {
        // Skip
      } else if (acc.length === 0) {
        // Initial date
        acc.push({x: date(i.start_time), y: i.end_location - i.start_location});
      } else if (date(acc[acc.length-1].x) === date(i.start_time)) {
        // Same date as previous
        acc[acc.length-1].y += i.end_location - i.start_location;
      } else if (datePlus1(acc[acc.length-1].x) === date(i.start_time)) {
        // Day + 1
        acc.push({x: date(i.start_time), y: i.end_location - i.start_location});
      } else {
        // Add day with no records
        acc.push({x: datePlus1(acc[acc.length-1].x), y: 0})
        shouldRepeat = true;
      }
    } while (shouldRepeat);

    return acc
  }, []);

  while (date(data[data.length-1].x) < date(dateMax)) {
    data.push({x: datePlus1(data[data.length-1].x), y: 0});
  }

  return data;
}
