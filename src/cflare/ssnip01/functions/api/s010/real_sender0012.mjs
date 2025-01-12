export async function sendCalSpecRequest(ctx) {
  return await ctx.smart_llm.sendRequest(ctx, ctx.prompt, ctx.image_data);
}

