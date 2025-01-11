export async function sendStorySpecRequest(ctx, lesson, emoji, emojiArray) {
  const prompt = ctx.prompt.makeStorySpecPrompt(lesson, emoji, emojiArray);
  return await ctx.smart_llm.sendRequest(ctx, prompt);
}

