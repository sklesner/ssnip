// import * as sLLM from './static0010.mjs';
import * as gLLM from '../v020/gpt0010.mjs';
import * as cLLM from './llm/claude0012.mjs';
import * as qLLM from '../v020/groq0010.mjs';

import * as CACHE from '../v020/cache0010.mjs'
import * as UTILITY from '../v020/utility0012.mjs'
// import * as PROMPT from '../v020/prompt0010c.mjs'
import * as PROMPT from './prompt/make_calendar_prompt_0010.mjs'

import * as pSENDER from '../v020/pseudo_sender0012.mjs'
import * as rSENDER from './real_sender0012.mjs'

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
    
    // "smart_llm":gLLM,
    "smart_llm":cLLM,
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
  
  // Extract JSON parameters from request body
  let params;
  try {
    params = await request.json();
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Invalid JSON in request body"
      }),
      { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  

  // Validate required parameters
  const requiredParams = ['event_prefix', 'start_date', 'media_type', 'image_data'];
  const missingParams = requiredParams.filter(param => !(param in params));
  
  if (missingParams.length > 0) {
    return new Response(
      JSON.stringify({
        error: `Missing required parameters: ${missingParams.join(', ')}`
      }),
      { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Extract parameters
  const { 
    event_prefix,
    start_date,
    media_type,
    image_data 
  } = params;


  const prompt = PROMPT.make_calendar_prompt(start_date);

  // TODO: retry when CalSpec is not a valid JSON
  const CalSpec = await ctx.smart_llm.sendRequest(ctx, prompt, image_data);

  // TODO: Process the parameters and generate actual response
  return new Response(
    JSON.stringify({
      "output": `${CalSpec}`,
      "received_params": {
        event_prefix,
        start_date,
        media_type,
        image_data: image_data.substring(0, 10) + '...' // Truncate for logging
      }
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    }
  );




}
