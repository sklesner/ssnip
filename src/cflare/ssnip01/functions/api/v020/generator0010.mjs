

export async function makeStory(ctx, lesson, emoji) {
  let storySpec;
  for (let i = 0; i < 4; i++) {
      if (i > 0) console.log('story try: ' + (i - 1));
      
      storySpec = // STORY LLM CONFIG
        //  STATIC.sendStoryRequest(ctx, txtFileMap, lesson, emoji);
        await ctx.sender.sendStoryRequest(ctx, lesson, emoji);
        // await CLAUDE.sendStoryRequest(ctx, lesson, emoji);
        // await GROQ.sendStoryRequest(ctx, lesson, emoji);
      
      if (ctx.parser.sceneTest(storySpec)) break;
  }

  if (!ctx.parser.sceneTest(storySpec)) {
      throw new Error('Failed to generate a valid story response after multiple attempts');
  }

  return storySpec;
}


export async function genPictureSpec(ctx, storySpec) {
  let imageDesc;

  for (let i = 0; i < 4; i++) {
    if (i > 0) console.log('pictures try: ' + (i - 1));

    imageDesc = // PICTURE LLM CONFIG
      //  STATIC.sendPicturesRequest(ctx, txtFileMap, storySpec);
      // await GPT.sendPicturesRequest(ctx, storySpec);
      await ctx.sender.sendPicturesRequest(ctx, storySpec);
      // await CLAUDE.sendPicturesRequest(ctx, storySpec);
    
    if (ctx.parser.pictureTest(imageDesc)) break;
  }

  if (!ctx.parser.pictureTest(imageDesc)) {
      throw new Error('Failed to generate a valid picture descriptions response after multiple attempts');
  }

  const pictureArray = ctx.parser.makePictureArray(imageDesc);

  return pictureArray;
}


export async function imageGen(ctx, imageDesc, imageName) {
  
  const image = await ctx.env.AI.run(
    "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    {
      // prompt: imageDesc + " Whimsical Expressive Playful Energetic Loose Sketchy Humorous Vibrant Dynamic Spontaneous Characterful Imaginative",
      // prompt: imageDesc + " in the art style of Edward Gorey and Tim Burton",
      prompt: imageDesc + " in the art style of Edward Gorey and Tim Burton and H. R. Giger",
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

export async function twineImageGen(ctx, imageDescs, storyId) {
  await Promise.all([
    // PICTURE COUNT CONFIG
    imageGen(ctx, imageDescs[0], `${storyId}_picture_p2`),
    imageGen(ctx, imageDescs[1], `${storyId}_picture_p3`),
    imageGen(ctx, imageDescs[2], `${storyId}_picture_p4`),
    imageGen(ctx, imageDescs[3], `${storyId}_picture_p5`),
    imageGen(ctx, imageDescs[4], `${storyId}_picture_p6`),
    imageGen(ctx, imageDescs[5], `${storyId}_picture_p7`)
  ]);
  await ctx.cache.purgeCacheForStory(ctx,storyId)
}


export async function genQuestionSpec(ctx, storySpec) {
  let q1, q2;
  let q1Valid = false, q2Valid = false;
  let attempts = 0;
  const maxAttempts = 4;

  while ((!q1Valid || !q2Valid) && attempts < maxAttempts) {
    attempts++;

    if (!q1Valid) {
      try {
        // Q1 LLM CONFIG
        // q1 = STATIC.sendQuestion1Request(ctx, txtFileMap, storySpec);
        // q1 = await GPT.sendQuestion1Request(ctx, storySpec);
        q1 = await ctx.sender.sendQuestion1Request(ctx, storySpec);
        // q1 = await CLAUDE.sendQuestion1Request(ctx, storySpec);

        q1Valid = ctx.parser.questionTest(q1);
      } catch (error) {
        console.error(`Error in q1 attempt ${attempts}:`, error);
      }
    }

    if (!q2Valid) {
      try {
        // Q2 LLM CONFIG
        // q2 = STATIC.sendQuestion2Request(ctx, txtFileMap, storySpec);
        // q2 = await GPT.sendQuestion2Request(ctx, storySpec);
        q2 = await ctx.sender.sendQuestion2Request(ctx, storySpec);
        // q2 = await CLAUDE.sendQuestion2Request(ctx, storySpec);

        q2Valid = ctx.parser.questionTest(q2);
      } catch (error) {
        console.error(`Error in q2 attempt ${attempts}:`, error);
      }
    }

    if (attempts > 1) {
      console.log(`Retry attempt: ${attempts - 1}`);
    }
  }

  if (!q1Valid) {
    throw new Error('Failed to generate a valid question1 spec response after multiple attempts');
  }

  if (!q2Valid) {
    throw new Error('Failed to generate a valid question2 spec response after multiple attempts');
  }

  const q1Dict = ctx.parser.makeQuestionDict(q1);
  const q2Dict = ctx.parser.makeQuestionDict(q2);

  return [q1Dict, q2Dict];
}

