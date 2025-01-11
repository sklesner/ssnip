
export async function makeStorySpec(ctx) {
  let storySpec;
  let jsonObj;
  for (let i = 0; i < 4; i++) {
    if (i > 0) console.log('story try: ' + (i - 1));
    const response = await ctx.sender.sendStorySpecRequest(ctx);
    jsonObj = ctx.parser.jsonToStorySpec(response);
    
    // If parsing succeeds, test the resulting object
    if (jsonObj && ctx.parser.storySpecTest(jsonObj)) {
      storySpec = jsonObj;
      break;
    }
  }

  if (!storySpec) {
    console.log('Failed to generate a valid story response after multiple attempts');
    throw new Error('Failed to generate a valid story response after multiple attempts');
  }

  return storySpec;
}


export async function imageGen1(ctx, imageDesc, imageName) {
  
  const image = await ctx.env.AI.run(
    "@cf/stabilityai/stable-diffusion-xl-base-1.0",    
    {
      // prompt: imageDesc + " Whimsical Expressive Playful Energetic Loose Sketchy Humorous Vibrant Dynamic Spontaneous Characterful Imaginative",
      // prompt: imageDesc + " in the art style of Edward Gorey and Tim Burton",
      // prompt: imageDesc + " in the art style of Edward Gorey and Tim Burton and H. R. Giger",
      // prompt: imageDesc + " in the art style of anime chibi kawaii",
      prompt: imageDesc + " in style of Quentin Blake and Edward Gorey", 
      // prompt: imageDesc + " in style of Studio Ghibli and Edward Gorey, Whimsical, Expressive, Playful, Energetic, Sketchy, Vibrant, Dynamic, Spontaneous", 
      // prompt: imageDesc + " in the art style of Edward Gorey, Tim Burton, Shel Silverstein, Gahan Wilson",
      negative_prompt: "Disfigured, blurry, nude, sloppy, deformed, mutated, ugly",
      // height: 768, width: 768,
      // height: 900, width: 1024,
      height: 1024, width: 1024,
    }
  );

  if (image) {
    await ctx.env.TWINE_BUCKET.put(imageName + '.png', image);
  }
}

export async function imageGen2(ctx, imageDesc, imageName) {
  // TODO BROKEN
  const image = await ctx.env.AI.run(
    "@cf/black-forest-labs/flux-1-schnell",
    {
      // prompt: imageDesc + " Whimsical Expressive Playful Energetic Loose Sketchy Humorous Vibrant Dynamic Spontaneous Characterful Imaginative",
      // prompt: imageDesc + " in the art style of Edward Gorey and Tim Burton",
      // prompt: imageDesc + " in the art style of Edward Gorey and Tim Burton and H. R. Giger",
      // prompt: imageDesc + " in the art style of anime chibi kawaii",

      // prompt: imageDesc + " in style of Quentin Blake and Edward Gorey", 
      prompt: imageDesc

      // prompt: imageDesc + " in style of Studio Ghibli and Edward Gorey, Whimsical, Expressive, Playful, Energetic, Sketchy, Vibrant, Dynamic, Spontaneous", 
      // prompt: imageDesc + " in the art style of Edward Gorey, Tim Burton, Shel Silverstein, Gahan Wilson",
      // negative_prompt: "Disfigured, blurry, nude, sloppy, deformed, mutated, ugly",
      // height: 768, width: 768,
      // height: 900, width: 1024,
      // height: 1024, width: 1024,
      // num_steps:6
    }
  );

  if (image) {
    await ctx.env.TWINE_BUCKET.put(imageName + '.jpg', image);
  }
}


// export async function imageGen(ctx, imageDesc, imageName) {
//   imageGen1(ctx, imageDesc, imageName);
// }

export async function twineImageGen(ctx, storySpec, storyId) {
  await Promise.all([
    // PICTURE COUNT CONFIG
    imageGen1(ctx, storySpec.scene_array[0].scene_picture, `${storyId}_picture_p2`),
    imageGen1(ctx, storySpec.scene_array[1].scene_picture, `${storyId}_picture_p3`),
    imageGen1(ctx, storySpec.scene_array[2].scene_picture, `${storyId}_picture_p4`),
    imageGen1(ctx, storySpec.scene_array[3].scene_picture, `${storyId}_picture_p5`),
    imageGen1(ctx, storySpec.scene_array[4].scene_picture, `${storyId}_picture_p6`),
    imageGen1(ctx, storySpec.scene_array[5].scene_picture, `${storyId}_picture_p7`)
  ]);

  // await ctx.cache.purgeCacheForStory(ctx,storyId)
}
