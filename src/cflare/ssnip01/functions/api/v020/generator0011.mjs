
export async function makeStorySpec(ctx, lesson, emoji, emojiArray) {
  let storySpec;
  let jsonObj;
  for (let i = 0; i < 4; i++) {
    if (i > 0) console.log('story try: ' + (i - 1));
    const response = await ctx.sender.sendStorySpecRequest(ctx, lesson, emoji,emojiArray);
    jsonObj = ctx.parser.jsonToStorySpec(response);
    
    // If parsing succeeds, test the resulting object
    if (jsonObj && ctx.parser.storySpecTest(jsonObj)) {
      storySpec = jsonObj;
      break;
    }
  }

  if (!storySpec) {
    throw new Error('Failed to generate a valid story response after multiple attempts');
  }

  return storySpec;
}


export async function imageGen(ctx, imageDesc, imageName) {
  
  const image = await ctx.env.AI.run(
    "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    {
      // prompt: imageDesc + " Whimsical Expressive Playful Energetic Loose Sketchy Humorous Vibrant Dynamic Spontaneous Characterful Imaginative",
      // prompt: imageDesc + " in the art style of Edward Gorey and Tim Burton",
      // prompt: imageDesc + " in the art style of Edward Gorey and Tim Burton and H. R. Giger",
      // prompt: imageDesc + " in the art style of anime chibi kawaii",
      prompt: imageDesc + " in the colorful sketch drawing art style of Studio Ghibli magical realism Edward Gorey Whimsical Expressive Playful Energetic Loose Sketchy Humorous Vibrant Dynamic Spontaneous Characterful Imaginative", 
      // prompt: imageDesc + " in the art style of Edward Gorey, Tim Burton, Shel Silverstein, Gahan Wilson",
      negative_prompt: "Disfigured, blurry, nude, sloppy, deformed, mutated, ugly",
      // height: 768, width: 768,
      height: 1024, width: 1024,
    }
  );

  if (image) {
    await ctx.env.TWINE_BUCKET.put(imageName + '.png', image);
  }
}

export async function twineImageGen(ctx, storySpec, storyId) {
  await Promise.all([
    // PICTURE COUNT CONFIG
    imageGen(ctx, storySpec.scene_array[0].scene_picture, `${storyId}_picture_p2`),
    imageGen(ctx, storySpec.scene_array[1].scene_picture, `${storyId}_picture_p3`),
    imageGen(ctx, storySpec.scene_array[2].scene_picture, `${storyId}_picture_p4`),
    imageGen(ctx, storySpec.scene_array[3].scene_picture, `${storyId}_picture_p5`),
    imageGen(ctx, storySpec.scene_array[4].scene_picture, `${storyId}_picture_p6`),
    imageGen(ctx, storySpec.scene_array[5].scene_picture, `${storyId}_picture_p7`)
  ]);

  await ctx.cache.purgeCacheForStory(ctx,storyId)
}
