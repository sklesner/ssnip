export async function onRequest(context) {
  const bucket = context.env.STORY_BUCKET;
  
  if (!bucket) {
    return new Response("Bucket 'STORY_BUCKET' not found", { status: 404 });
  }

  try {
    const files = await bucket.list();
    const fileList = files.objects.map(file => file.key);

    return new Response(JSON.stringify(fileList), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}