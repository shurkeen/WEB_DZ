import { MIN, MAX } from "./requests";

export const formatDate = (isoDateString, param) => {
    const date = new Date(isoDateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    switch(param){
        case "html":
            return `${year}-${month}-${day}`;
        default:
            return `${day}.${month}.${year}`;
    }
}

export const getCurrDateHtml = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const isDurationWithinLimits = (date_start, date_end) => {
    const startDate = new Date(date_start);
    const endDate = new Date(date_end);

    const differenceInMs = endDate - startDate;

    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    if (differenceInDays <= MIN || differenceInDays >= MAX) {
        alert(`Продолжительность рекламы должна быть не менее ${MIN} и не более ${MAX} дней!`);
        return false;
    }

    return true;
}