import { createClient } from '@supabase/supabase-js';

export async function onRequestPost(context) {
  const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_KEY);
  
  const { data, error } = await supabase
    .from("asset")
    .insert({ 
        'asset_type_id': 's'
        , 'external_id': 'DK'
        , 'words': 'Denmark, DK, Copenhagen, Danish, Denmark'
      })
    .select();

  if (error) throw error;
  
  // here the value of data should be [{"asset_id":7,"asset_type_id":"s","external_id":"DK","words":"Denmark, DK, Copenhagen, Danish, Denmark","created_at":"2024-08-07T04:09:16.758788"}]
  
  const asset_id = data[0].asset_id; 

  return new Response(asset_id.toString(), { 
    headers: {
      "Content-Type": "application/json",
    },
  });
}