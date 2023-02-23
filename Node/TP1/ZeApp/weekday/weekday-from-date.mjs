// weekday-from-date.mjs (ES Module) 
const WEEKDAY = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; 
		
export function weekDayFromDate(date) { 
    if (!(date instanceof Date)) { 
        date = new Date(date); 
    } 
    return WEEKDAY[date.getDay()]; 
}