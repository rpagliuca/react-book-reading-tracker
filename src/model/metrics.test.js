import * as metrics from './metrics.js';

it('calculates accumulated totals', () => {

  const today = "2021-03-18";
  const data = metrics.accumulatedPerDate(mockData, today);

  const expected = [
    {x: "2021-03-11", y: 19},
    {x: "2021-03-12", y: 49}, // +30
    {x: "2021-03-13", y: 69}, // +20
    {x: "2021-03-14", y: 119}, // +50
    {x: "2021-03-15", y: 119},
    {x: "2021-03-16", y: 119},
    {x: "2021-03-17", y: 119},
    {x: "2021-03-18", y: 119}
  ];

  expect(data).toStrictEqual(expected);
});

it('calculates accumulated totals with edge range', () => {

  const today = "2021-03-13";
  const data = metrics.accumulatedPerDate(mockData, today);

  const expected = [
    {x: "2021-03-11", y: 19},
    {x: "2021-03-12", y: 49}, // +30
    {x: "2021-03-13", y: 69}, // +20
  ];

  expect(data).toStrictEqual(expected);
});

it('adds 1 day to date', () => {
  const got = metrics.datePlus1("2021-03-18");
  expect(got).toBe("2021-03-19");
});

export const mockData = [
  {
    "book_id": "Book1",
    "start_time": "2021-03-11T09:00:00-03:00",
    "start_location": 1,
    "end_time": "2021-03-11T09:21:15-03:00",
    "end_location": 20,
  },
  {
    "book_id": "Book1",
    "start_time": "2021-03-12T09:35:30-03:00",
    "start_location": 20,
    "end_time": "2021-03-12T09:42:00-03:00",
    "end_location": 50,
  },
  {
    "book_id": "Book1",
    "start_time": "2021-03-13T09:35:30-03:00",
    "start_location": 50,
    "end_time": "2021-03-13T09:42:00-03:00",
    "end_location": 70,
  },
  {
    "book_id": "Book1",
    "start_time": "2021-03-14T14:10:30-03:00",
    "start_location": 70,
    "end_time": "2021-03-14T15:20:00-03:00",
    "end_location": 120,
  }
];

