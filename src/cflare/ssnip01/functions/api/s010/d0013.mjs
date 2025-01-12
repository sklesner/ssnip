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


function extractJSON(text) {
  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');
  
  if (startIndex === -1 || endIndex === -1) {
    return null;
  }
  
  const jsonString = text.substring(startIndex, endIndex + 1);
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

async function getLLMOutput(ctx, prompt, imageData, maxRetries = 3) {
  let attempts = 0;
  let lastError = null;

  while (attempts < maxRetries) {
    try {
      const response = await ctx.smart_llm.sendRequest(ctx, prompt, imageData);
      console.log('Response:', response.substring(0, 50));

      const parsedJSON = extractJSON(response);
      if (parsedJSON) {
        return parsedJSON;
      }
      
      attempts++;
      if (attempts < maxRetries) {
        // Add exponential backoff if we're going to retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    } catch (error) {
      // If it's an error from the LLM function, throw it immediately
      throw error;
    }
  }
  
  // If we've exhausted all attempts without a valid JSON, throw the max retries error
  throw new Error('Failed to get valid JSON response after maximum retries');
}

export async function onRequest(context) {  
  const { env, request } = context;
  
  var ctx = {
    "env": env,
    "request": request,
    "smart_llm": cLLM,
    "sender": rSENDER,
    "fast_llm": gLLM,
    "cache": CACHE,
    "utility": UTILITY,
    "prompt": PROMPT,
    "generator": GENERATOR,
    "parser": PARSER,
    "template": TEMPLATE,
    "db": DB,
  }

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

  try {
    const CalSpec = await getLLMOutput(ctx, prompt, image_data);

    return new Response(
      JSON.stringify({
        "output": CalSpec,
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
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to process LLM response",
        details: error.message
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}