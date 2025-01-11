export async function sendStorySpecRequest(ctx) {
  // let file = await ctx.ASSETS.fetch('https://joe.ackop.com/assets/story/sample_input.txt');
  let file = ctx.txtFileMap.get("sample_story_spec");
  console.log('sendStorySpecRequest() using sample_story_spec');
  return file;
}

