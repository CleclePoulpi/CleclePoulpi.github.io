// weekday.mjs (ES Module) 
import { weekDayFromDate } from './weekday-from-date.mjs'; 
const dateString = process.argv[2] ?? null; 
console.log(weekDayFromDate(dateString));