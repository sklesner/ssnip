import * as DB from './db0010.mjs';
import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {  
  const { env, request } = context;
  
  var ctx = {
    "env": env,
    "request": request,
    "db": DB,
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
  }

  // Ensure request method is POST
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Parse JSON from the POST request body
  try {
    const requestBody = await request.json(); // Parse JSON body

    // Extract values from the request body
    const vote_type_id = requestBody.vote_type_id;
    const asset_type_id = requestBody.asset_type_id; // c=scene s=story 
    const internal_id = requestBody.internal_id; // story id
    const external_id = requestBody.external_id; // page num
    const vote_value = requestBody.vote_value;

    // Validate the required fields
    if (!vote_type_id || !asset_type_id || !internal_id || !external_id || vote_value === undefined) {
      return new Response('Missing required fields in request body', { status: 400 });
    }

    // Initialize Supabase client
    const supabase = createClient(
      context.env.SUPABASE_URL,
      context.env.SUPABASE_ANON_KEY
    );

    // Call the database function voteRegister
    const vote_id = await ctx.db.voteRegister(
      supabase,
      vote_type_id,
      asset_type_id,
      internal_id,
      external_id,
      vote_value
    );
    
    // Handle the response or return any relevant data
    return new Response(JSON.stringify({ vote_id }), { status: 200, headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*", } });

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
