import moment from "moment";

export function formatTs(timestamp: string): string {
  return moment(new Date(parseInt(timestamp))).format("MMMM Do, YYYY");
}

export function pluralize(word: string, count: number) {
  return `${word}${count == 1 ? "" : "s"}`;
}
