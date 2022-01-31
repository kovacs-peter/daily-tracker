import { getActiveDays } from "./storage";

const calendar = () => {
    const feb = today.isLeapYear() ? 29 : 28;
    return [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};
let firstMonths = null;
export const today = new Date();
export const monthsAbbrev = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
export const initMonths = () => {
    if (firstMonths) return firstMonths;
    const thisMonth = today.getMonth();
    const nMonths = calendar().slice(0, thisMonth + 1);
    nMonths[thisMonth] = today.getDate();
    firstMonths = nMonths;
    return firstMonths;
};
export const isToday = (monthIndex, dayIndex) => initMonths().length === monthIndex + 1 && dayIndex + 1 === today.getDate();
export const calcActivedays = () => {
    let delay = 1;
    let actives = {};
    const initActive = getActiveDays();
    initActive.forEach((month, monthIndex) => {
        month.forEach((day) => {
            actives = {
                ...actives,
                [monthIndex]: {
                    ...actives[monthIndex],
                    [day]: delay,
                },
            };
            delay += 50;
        });
    });
    return actives;
};
export const calculatePercent = (val) => Math.ceil((val / (today.isLeapYear() ? 366 : 365)) * 100);
