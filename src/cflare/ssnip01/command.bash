# install dependencies

# list deployments

npx wrangler pages deployment list --project-name ssnip01


# deploy
#npx wrangler pages deploy public --project-name ssnip01 --commit-dirty=true

# npx wrangler pages deploy && ( ( sleep 5 ; curl https://joe.ackop.com/api/animal12 ) & npx wrangler pages deployment tail --project-name ssnip01  )




npx wrangler pages deploy  --commit-dirty=true &&  npx wrangler pages deployment tail --project-name ssnip01



bash ptwee_expand.bash | npx wrangler pages deploy  --commit-dirty=true &&  npx wrangler pages deployment tail --project-name ssnip01

# run js locally 
(cat functions/api/twine0010.js | perl -pe's{^export }{}g' ; echo "main()" ) | node -


## curl https://ackop.com/api/tpurge0010 && curl https://ackop.com/api/spurge0010

curl -X POST https://joe.ackop.com/api/asset_add_0010 \
  -H "Content-Type: application/json" \
  -d '{
    "asset_type_id": "s",
    "external_id": "example-external-id",
    "words": "This is a new story asset."
  }'

curl -X POST https://joe.ackop.com/api/asset_list_0010 \
  -H "Content-Type: application/json" \
  -d '{
    "asset_type_id": "s",
    "external_id": "example-external-id",
    "words": "This is a new story asset."
  }'


curl -X GET "https://api.cloudflare.com/client/v4/zones" \
-H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
-H "X-Auth-Key: ${CLOUDFLARE_API_TOKEN}" \
-H "Content-Type: application/json"



(
  set -o xtrace \
  && . .env \
  && STORY_ID=55 \
  && curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CLOUDFLARE_PURGE_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "files": [
      "https://twine.ackop.com/'${STORY_ID}'_picture_p2.png",
      "https://twine.ackop.com/'${STORY_ID}'_picture_p3.png",
      "https://twine.ackop.com/'${STORY_ID}'_picture_p4.png",
      "https://twine.ackop.com/'${STORY_ID}'_picture_p5.png",
      "https://twine.ackop.com/'${STORY_ID}'_picture_p6.png",
      "https://twine.ackop.com/'${STORY_ID}'_picture_p7.png"
    ]
  }'
)






