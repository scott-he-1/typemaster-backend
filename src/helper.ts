import { Score, User } from "@prisma/client";

export const sortScoreBy = (scores: Score[], type: string) => {
  let result = scores;

  switch (type) {
    case "asc":
      result = result.sort((a, b) =>
        a.score > b.score ? 1 : a.score < b.score ? -1 : 0
      );
      break;
    case "desc":
      result = result
        .sort((a, b) => (a.score > b.score ? 1 : a.score < b.score ? -1 : 0))
        .reverse();
      break;
    default:
      break;
  }

  return result;
};

export const newDateFormatter = (date: Date) => {
  const months: {
    [key: string]: string;
  } = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };
  let day = String(date.getDate());
  let fullMonth = months[date.getMonth() + 1];
  let year = date.getFullYear();
  return `${fullMonth} ${day}, ${year}`;
};
