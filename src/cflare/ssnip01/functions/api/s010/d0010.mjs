// import * as sLLM from './static0010.mjs';
import * as gLLM from '../v020/gpt0010.mjs';
import * as cLLM from '../v020/claude0011.mjs';
import * as qLLM from '../v020/groq0010.mjs';

import * as CACHE from '../v020/cache0010.mjs'
import * as UTILITY from '../v020/utility0012.mjs'
// import * as PROMPT from '../v020/prompt0010c.mjs'
import * as PROMPT from '../v020/prompt0012.mjs'

import * as pSENDER from '../v020/pseudo_sender0012.mjs'
import * as rSENDER from '../v020/real_sender0012.mjs'

import * as GENERATOR from '../v020/generator0012.mjs'
import * as PARSER from '../v020/parser0012.mjs'
import * as TEMPLATE from '../v020/template0015.mjs'
import * as DB from '../v020/db0010.mjs'

import { createClient } from '@supabase/supabase-js'

export async function onRequest(context) {  
  const { env, request } = context;
  
  var ctx = {
    "env": env,
    "request": request,
    
    "smart_llm":gLLM,
    // "smart_llm":cLLM,
    // "smart_llm":qLLM,

    // "sender": pSENDER,
    "sender": rSENDER,

    // "fast_llm":qLLM,
    "fast_llm":gLLM,

    "cache": CACHE,
    "utility": UTILITY,
    "prompt": PROMPT,
    
    "generator": GENERATOR,
    "parser": PARSER,
    "template": TEMPLATE,
    "db":DB,
  }

  const url = new URL(request.url);
 
  // ctx.emojiDelimited = url.searchParams.get('e') || "☕-💎-🎶-👩-🗽-🍞";
  // ctx.sixEmoji = ctx.emojiDelimited.replace(/-/g, '');
  // ctx.emojiArray = ctx.emojiDelimited.split('-')

  // ctx.txtFileMap = await ctx.utility.loadTxtFiles(env);
    
  // const backgroundWork = async () => {

  //   const supabase = createClient(
  //     context.env.SUPABASE_URL,
  //     context.env.SUPABASE_ANON_KEY
  //   )

  //   // ctx.supabase = supabase;

  //   ctx.storyId = await ctx.db.assetRegister(supabase, 's', ctx.emojiDelimited, '');
  //   console.log("storyId:", ctx.storyId);

  //   ctx.storyPrompt = ctx.prompt.makeStorySpecPrompt(ctx);

  //   console.log("storyPrompt:\n\n", ctx.storyPrompt);

  //   // await ctx.env.STORY_BUCKET.put(
  //   //   ctx.storyId + '_' + ctx.emojiDelimited + '_storyPrompt.txt'
  //   //   ,ctx.storyPrompt
  //   //   ,{httpMetadata: {
  //   //     contentType: 'text/plain',
  //   //   }}
  //   // );
   
  //   ctx.storySpec = await ctx.generator.makeStorySpec(ctx);
    
  //   // console.log("storySpec:", ctx.storySpec);

  //   await ctx.env.STORY_BUCKET.put(
  //     ctx.storyId + '_' + ctx.emojiDelimited + '_storySpec.txt'
  //     ,JSON.stringify(ctx.storySpec)
  //     ,{httpMetadata: {
  //       contentType: 'text/plain',
  //     }}
  //   );

  //   const storyTwine = await ctx.template.makeTwine(ctx, ctx.storyId, ctx.sixEmoji, ctx.storySpec, ctx.emojiDelimited);
    
  //   if (storyTwine) {
      
  //     await env.TWINE_BUCKET.put(
  //       // storyId + '.html'
  //       ctx.emojiDelimited + '.html'
  //       ,storyTwine
  //       ,{httpMetadata: {
  //         contentType: 'text/html',
  //       }}
  //     );

  //     await ctx.db.assetConfirm(supabase, ctx.storyId)
  //   }

  //   // TODO - add picture generation asset tracking
  //   // TODO - add quiz generation asset tracking
    
  //   await ctx.generator.twineImageGen(ctx,ctx.storySpec,ctx.storyId);

  //   // await ctx.cache.purgeCacheForStory(ctx,ctx.storyId)

  //   console.log("done!")
  // };

  // context.waitUntil(backgroundWork());

  // const stream = new ReadableStream({
  //   async start(controller) {
  //     const encoder = new TextEncoder();
  //     const initialHtml = ctx.utility.makeGeneratingHtml(ctx);
  //     controller.enqueue(encoder.encode(initialHtml));

  //     let count = 0;
  //     const maxUpdates = 10; // Adjust as needed
  //     const interval = setInterval(async () => {
  //       if (count >= maxUpdates) {
  //         clearInterval(interval);
  //         controller.close();
  //         return;
  //       }
  //       const updateHtml = `<script>document.getElementById('status').textContent = '(${count + 1}/${maxUpdates})';</script>`;
  //       controller.enqueue(encoder.encode(updateHtml));
  //       count++;
  //     }, 5000); 
  //   }
  // });

  // return new Response(stream, {
  //   status: 200,
  //   headers: {
  //     'Content-Type': 'text/html',
  //     'Transfer-Encoding': 'chunked',
  //     'Cache-Control': 'no-cache',
  //   },
  // });

  return new Response(
    JSON.stringify({
      "events": [
        {
          "date": "2025-01-15",
          "day": "Wednesday",
          "title": "CS256: Assignment 1"
        },
        {
          "date": "2025-01-16",
          "day": "Thursday", 
          "title": "CS256: Quiz 1"
        },
        {
          "date": "2025-01-22",
          "day": "Wednesday",
          "title": "CS256: Assignment 2"
        },
        {
          "date": "2025-01-23",
          "day": "Thursday",
          "title": "CS256: Quiz 2"
        },
        {
          "date": "2025-01-29",
          "day": "Wednesday",
          "title": "CS256: Assignment 3"
        },
        {
          "date": "2025-01-30",
          "day": "Thursday",
          "title": "CS256: Quiz 3"
        },
        {
          "date": "2025-02-05",
          "day": "Wednesday",
          "title": "CS256: Assignment 4"
        },
        {
          "date": "2025-02-06",
          "day": "Thursday",
          "title": "CS256: Quiz 4"
        },
        {
          "date": "2025-02-12",
          "day": "Wednesday",
          "title": "CS256: Assignment 5"
        },
        {
          "date": "2025-02-13",
          "day": "Thursday",
          "title": "CS256: Quiz 5"
        },
        {
          "date": "2025-02-19",
          "day": "Wednesday",
          "title": "CS256: Assignment 6"
        },
        {
          "date": "2025-02-20",
          "day": "Thursday",
          "title": "CS256: Quiz 6"
        },
        {
          "date": "2025-02-26",
          "day": "Wednesday",
          "title": "CS256: Assignment 7"
        },
        {
          "date": "2025-02-27",
          "day": "Thursday",
          "title": "CS256: Quiz 7"
        },
        {
          "date": "2025-03-05",
          "day": "Wednesday",
          "title": "CS256: Assignment 8"
        },
        {
          "date": "2025-03-06",
          "day": "Thursday",
          "title": "CS256: Quiz 8"
        },
        {
          "date": "2025-03-12",
          "day": "Wednesday",
          "title": "CS256: Assignment 9"
        },
        {
          "date": "2025-03-13",
          "day": "Thursday",
          "title": "CS256: Quiz 9"
        }
      ]
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );


}
