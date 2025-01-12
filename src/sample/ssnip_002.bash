curl https://ssnip.ranue.com/api/s010/d0014   -H "content-type: application/json"   -d @- << EOF
{
  "start_date": "2025-01-06",
  "media_type": "image/png",
  "image_data": "$(cat '/mnt/c/Users/chris/OneDrive/slesner/hackathon2024/inputs/cs170labs.PNG' | convert - -resize '1920x1080>' -strip - | base64 )"
}
EOF