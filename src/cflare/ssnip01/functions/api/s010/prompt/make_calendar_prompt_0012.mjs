export function make_calendar_prompt(startDate) {
    return `
    The attached image is a schedule of events some of which are due dates.
    From this schedule please output just the due dates using the EXAMPLE_JSON_FORMAT below.
    If the month or year is missing assume the schedule starts at approximately ${startDate} 
    IMPORTANT: Reply using the EXAMPLE_JSON_FORMAT and nothing else. 

    EXAMPLE_JSON_FORMAT:
    {
      "thoughts": "Use this to briefly record your inital thoughts about the task.",
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
      ],
      "caution": "If there is any trouble extracting due date events please explain trouble here otherwise leave this empty."
    }

    IMPORTANT: Reply using the EXAMPLE_JSON_FORMAT and nothing else. 

    `
  }
