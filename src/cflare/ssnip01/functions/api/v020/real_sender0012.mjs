export async function sendStorySpecRequest(ctx) {
  return await ctx.smart_llm.sendRequest(ctx, ctx.storyPrompt);
}

