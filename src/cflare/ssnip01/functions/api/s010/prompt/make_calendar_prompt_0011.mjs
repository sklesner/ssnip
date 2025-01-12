export function make_calendar_prompt(startDate) {
    return `
    The attached image is a schedule of events some of which are due dates.
    From this schedule plesae output just the due dates using the JSON format below.
    If the month or year is missing assume the schedule starts at approximately ${startDate} 
    IMPORTANT: Reply using the EXAMPLE_JSON_FORMAT below and nothing else. 

    EXAMPLE_JSON_FORMAT:
    {
      "conversion_explanaton": "Explain how the due date events were extracted and any trouble encountered.",
      "events": [
        {
          "date": "YYYY-MM-DD",
          "name": "Assignment 1 Due"
        },
        {
          "date": "YYYY-MM-DD",
          "name": "Assignment 2 Due"
        },
        ...
      ]
    }
    `
  }
