// import * as sLLM from './static0010.mjs';
import * as gLLM from './gpt0010.mjs';
import * as cLLM from './claude0010.mjs';
import * as qLLM from './groq0010.mjs';

import * as CACHE from './cache0010.mjs'
import * as UTILITY from './utility0011.mjs'
import * as PROMPT from './prompt0010.mjs'
import * as pSENDER from './pseudo_sender0011.mjs'
import * as rSENDER from './real_sender0011.mjs'
import * as GENERATOR from './generator0011.mjs'
import * as PARSER from './parser0011.mjs'
import * as TEMPLATE from './template0013.mjs'
import * as DB from './db0010.mjs'

import { createClient } from '@supabase/supabase-js'

export async function onRequest(context) {  
  const { env, request } = context;
  
  var ctx = {
    "env": env,
    "request": request,
    
    "smart_llm":gLLM,
    // "smart_llm":cLLM,
    // "smart_llm":qLLM,
    
    // "fast_llm":qLLM,
    "fast_llm":gLLM,

    "cache": CACHE,
    "utility": UTILITY,
    "prompt": PROMPT,

    "sender": pSENDER,
    // "sender": rSENDER,
    
    "generator": GENERATOR,
    "parser": PARSER,
    "template": TEMPLATE,
    "db":DB,
  }

  const url = new URL(request.url);
  const emojiDelimited = url.searchParams.get('e') || "☕-💎-🎶-👩-🗽-🍞";
  const storyName = emojiDelimited.replace(/-/g, '');
    
  const backgroundWork = async () => {

    const supabase = createClient(
      context.env.SUPABASE_URL,
      context.env.SUPABASE_ANON_KEY
    )

    // ctx.supabase = supabase;

    ctx.txtFileMap = await ctx.utility.loadTxtFiles(env);

    const lesson = ctx.template.getLesson(ctx)
    console.log("Lesson:", lesson);

    const asset_id = await ctx.db.assetRegister(supabase, 's', emojiDelimited, lesson)
    const storySpec = await ctx.generator.makeStorySpec(ctx, lesson,storyName);

    // const storyId = await makeHash(storySpec)
    const storyId = asset_id
    console.log("storyId:", storyId);
   
    const storyTwine = await ctx.template.makeTwine(ctx, storyId,storyName,storySpec,emojiDelimited);
    
    await env.STORY_BUCKET.put(
      storyId + '_' + emojiDelimited + '.txt'
      ,JSON.stringify(storySpec)
      ,{httpMetadata: {
        contentType: 'text/plain',
      }}
    );
      
    if (storyTwine) {
      
      await env.TWINE_BUCKET.put(
        // storyId + '.html'
        emojiDelimited + '.html'
        ,storyTwine
        ,{httpMetadata: {
          contentType: 'text/html',
        }}
      );

      await ctx.db.assetConfirm(supabase, asset_id)
    }

    // TODO - add picture generation asset tracking
    // TODO - add quiz generation asset tracking
    
    await ctx.generator.twineImageGen(ctx,storySpec,storyId);

    await ctx.cache.purgeCacheForStory(ctx,storyId)

    console.log("done!")
  };

  context.waitUntil(backgroundWork());

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const initialHtml = await ctx.utility.makeGeneratingHtml(env, emojiDelimited);
      controller.enqueue(encoder.encode(initialHtml));

      let count = 0;
      const maxUpdates = 10; // Adjust as needed
      const interval = setInterval(async () => {
        if (count >= maxUpdates) {
          clearInterval(interval);
          controller.close();
          return;
        }
        const updateHtml = `<script>document.getElementById('status').textContent = '(${count + 1}/${maxUpdates})';</script>`;
        controller.enqueue(encoder.encode(updateHtml));
        count++;
      }, 5000); 
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  });

}
