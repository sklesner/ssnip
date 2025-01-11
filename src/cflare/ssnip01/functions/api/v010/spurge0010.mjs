export async function onRequest(context) {
  const bucket = context.env.STORY_BUCKET;
  
  if (!bucket) {
    return new Response("Bucket 'STORY_BUCKET' not found", { status: 404 });
  }

    try {
      // List all objects in the "story" bucket
      let objects = await bucket.list(
        // { prefix: "story/" }
      );
  
      // Delete each object
      const deletePromises = objects.objects.map(obj => bucket.delete(obj.key));
      await Promise.all(deletePromises);
  
      return new Response("All objects in the 'story' bucket have been deleted.", { status: 200 });
    } catch (error) {
      console.error("Error deleting objects:", error);
      return new Response("An error occurred while deleting objects.", { status: 500 });
    }
  }