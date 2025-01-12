curl https://ssnip.ranue.com/api/s010/d0012 \
  -H "content-type: application/json" \
  -d @- << EOF 
{
  "event_prefix": "cs203",
  "start_date": "2025-01-06",
  "media_type": "image/jpeg",
  "image_data": "$(cat _exclude/schedule_1.jpg | convert - -resize '1920x1080>' -strip - | base64)"
}
EOF



curl https://ssnip.ranue.com/api/s010/d0011 \
  -H "content-type: application/json" \
  -d @- << EOF 
{
  "event_prefix": "cs203",
  "start_date": "2025-01-06",
  "media_type": "image/jpeg",
  "image_data": "$(cat _ignore/schedule_1.jpg | convert - -resize '1920x1080>' -strip - | base64)"
}
EOF



curl https://ssnip.ranue.com/api/s010/d0011 \
  -H "content-type: application/json" \
  -d @- << EOF 
{
  "event_prefix": "cs203",
  "start_date": "2025-01-06",
  "media_type": "image/jpeg",
  "image_data": "hahahahaahahah"
}
EOF
