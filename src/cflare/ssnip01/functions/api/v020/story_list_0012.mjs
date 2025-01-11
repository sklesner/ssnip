import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
    
    // Handle CORS preflight requests
    if (context.request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }

    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_KEY);
    const { data, error } = await supabase.from("story_list").select('*');
    if (error) throw error;

    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });
}