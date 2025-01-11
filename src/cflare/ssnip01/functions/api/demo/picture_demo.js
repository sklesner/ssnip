export async function onRequest(context) {
  const { env } = context;

  const catPromise = env.AI.run(
    "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    {
      prompt: "cyberpunk cat",
    }
  );

  const dogPromise = env.AI.run(
    "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    {
      prompt: "cyberpunk dog", 
    }
  );

  // Wait for both promises to resolve
  const [cat_response, dog_response] = await Promise.all([catPromise, dogPromise]);

  // Store the results in the bucket concurrently
  await Promise.all([
    env.TWINE_BUCKET.put('cat.png', cat_response),
    env.TWINE_BUCKET.put('dog.png', dog_response), 
  ]);

  return new Response("OK", { status: 200 });
}