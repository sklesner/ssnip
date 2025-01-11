



export async function purgeCacheForStory(ctx,storyId) {

  if (!storyId) {
    console.error('Missing story_id parameter');
    return false;
  }

  const CLOUDFLARE_ZONE_ID = ctx.env.CLOUDFLARE_ZONE_ID;
  const CLOUDFLARE_PURGE_TOKEN = ctx.env.CLOUDFLARE_PURGE_TOKEN;

  if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_PURGE_TOKEN) {
    console.error('Missing Cloudflare configuration');
    return false;
  }

  const files = [2, 3, 4, 5, 6, 7].map(num => 
    `https://twine.ackop.com/${storyId}_picture_p${num}.png`
  );

  const url = `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`;
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_PURGE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (result.success) {
      console.log('Cache purge successful');
      return true;
    } else {
      console.error('Cache purge failed:', JSON.stringify(result.errors));
      return false;
    }
  } catch (error) {
    console.error('Error purging cache:', error.message);
    return false;
  }
}