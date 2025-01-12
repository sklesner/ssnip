curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d @- << EOF | jq -r '.content[0].text' > _exclude/output_004.json
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
          "text": "ONLY Return JSON array of CS256 ONLY due dates starting 2025-01-06. Format: 
          {
            [
              \\"date\\":\\"YYYY-MM-DD\\",\\"title\\":\\"CS256: {insert name}\\"},
              ...more items...
            ]
          }"
        }
      ]
    }
  ]
}
EOF

