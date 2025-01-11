import * as DB from './db0010.mjs';
import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {  
  const { env, request } = context;

  var ctx = {
    "env": env,
    "request": request,
    "db": DB,
  };

  // Ensure request method is GET
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Extract URL and query parameters from the request
    const url = new URL(request.url);
    const asset_type_id = url.searchParams.get('asset_type_id');
    const internal_id = url.searchParams.get('internal_id'); // story id
    const external_id = url.searchParams.get('external_id'); // page num

    // Validate the required fields
    if (!asset_type_id || !internal_id || !external_id) {
      return new Response('Missing required fields in query parameters', { status: 400 });
    }

    if (context.request.method === "OPTIONS") {
      return new Response(null, {
          headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
          },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(
      context.env.SUPABASE_URL,
      context.env.SUPABASE_ANON_KEY
    );

    // Call the database function voteRegister
    const count = await ctx.db.voteNet(
      supabase,
      asset_type_id,
      internal_id,
      external_id
    );

    // console.log("vote_net:"  + vote_net);

    // Handle the response or return any relevant data
    return new Response(
      JSON.stringify({ count: count })
      ,{ 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json', 
            "Access-Control-Allow-Origin": "*",
          } 
      }
    );

  } catch (error) {
    // Log the full error for debugging
    console.error('Error occurred:', error);

    // Send detailed error response
    return new Response(
      JSON.stringify({
        error: error.message || 'An unknown error occurred',
        stack: error.stack || 'No stack trace available',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

