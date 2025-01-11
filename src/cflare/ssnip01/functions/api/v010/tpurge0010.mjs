export async function onRequest(context) {
  const bucket = context.env.TWINE_BUCKET;
  
  if (!bucket) {
    return new Response("Bucket 'TWINE_BUCKET' not found", { status: 404 });
  }

    try {
      // List all objects in the "TWINE" bucket
      let objects = await bucket.list(
        // { prefix: "TWINE/" }
      );
  
      // Delete each object
      const deletePromises = objects.objects.map(obj => bucket.delete(obj.key));
      await Promise.all(deletePromises);
  
      return new Response("All objects in the 'TWINE' bucket have been deleted.", { status: 200 });
    } catch (error) {
      console.error("Error deleting objects:", error);
      return new Response("An error occurred while deleting objects.", { status: 500 });
    }
  }