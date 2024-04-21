export const dateTexts = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const dayTexts = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export function stringToDateString(datestr: string) {
    const date = new Date(datestr);
    const dateString = `${dayTexts[date.getDay()]} ${dateTexts[date.getUTCMonth()]} ${date.getDate()}, ${date.getUTCFullYear()}`
    return dateString;
}