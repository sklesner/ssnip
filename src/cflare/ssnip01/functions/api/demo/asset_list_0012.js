import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
    const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_KEY);
    const { data, error } = await supabase.from("asset_type").select('*');
    if (error) throw error;
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
};
