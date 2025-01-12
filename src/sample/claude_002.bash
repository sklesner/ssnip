curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d @- << EOF | jq -r '.content[0].text' > _exclude/output_000.json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user", 
      "content": [
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "$(cat _ignore/schedule_1.jpg | convert - -resize '1920x1080>' -strip - | base64)"
          }
        },
        {
          "type": "text",
          "text": "Please convert the schedule into JSON with dates in full format YY-MM-DD and day of week format with one JSON item per date (ie denormalize it). the events on the schedule start at approx. 2025-01-06. I want each item to have a single title with prefix 'CS256: '. Include only DUE DATEs and ignore everything else."
        }
      ]
    }
  ]
}
EOF


# BEFORE: $133.14
# AFTER: $133.12

