export function make_calendar_prompt(startDate) {
    return `Please convert the schedule into JSON with dates in full format YY-MM-DD and day of week format with one JSON item per date (ie denormalize it). 
    The events on the schedule start at approx. ${startDate}. 
    Include only DUE DATEs and ignore everything else.`
  }
