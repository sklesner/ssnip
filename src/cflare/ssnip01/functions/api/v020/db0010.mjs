
export async function voteRegister(
  supabase,
  vote_type_id,
  asset_type_id,
  internal_id,
  external_id,
  vote_value
){
  const { data, error } = await supabase
    .from('vote')
    .insert([
      {
        'user_id': 1,
        'vote_type_id':vote_type_id,
        'asset_type_id':asset_type_id,
        'internal_id': internal_id,
        'external_id':external_id,
        'vote_value': vote_value,
      },
    ])
    .select()

  if (error) throw error

  return data[0].vote_id
}

export async function voteTotal(
  supabase,
  asset_type_id,
  internal_id,
  external_id,
  vote_type_id
){
  const { data, error } = await supabase
    .from('tvote')
    .select('count')
    .match({
      asset_type_id: asset_type_id,
      internal_id: internal_id,
      external_id: external_id,
      vote_type_id: vote_type_id
    });

  if (error) {
    console.error('Error fetching vote total:', error);
    return null; // or handle the error as needed
  }

  if (data.length > 0) {
    return data[0].count; // Return the count value from the first matched row
  }

  return 0; // Return 0 if no rows match the criteria
}

export async function voteNet(
  supabase,
  asset_type_id,
  internal_id,
  external_id,
){
  const { data, error } = await supabase
    .from('nvote')
    .select('count')
    .match({
      asset_type_id: asset_type_id,
      internal_id: internal_id,
      external_id: external_id,
    });

    
  // console.log("data:"  + JSON.stringify(data));


  if (error) {
    console.error('Error fetching vote total:', error);
    return null; // or handle the error as needed
  }

  if (data.length > 0) {
    return data[0].count; // Return the count value from the first matched row
  }

  return 0; // Return 0 if no rows match the criteria
}

export async function assetRegister(
  supabase,
  asset_type_id,
  external_id,
  words
){
  const { data, error } = await supabase
    .from('asset')
    .insert([
      {
        'asset_type_id':asset_type_id,
        'external_id': external_id,
        'words': words,
      },
    ])
    .select()

  if (error) throw error

  return data[0].asset_id
}

export async function assetConfirm(
  supabase,
  asset_id,
  // worker_label,
  // log_text
){
  const { data, error } = await supabase
    .from('confirm')
    .insert([
      {
        asset_id,
        // worker_label,
        // log_text
      },
    ])
    .select()

  if (error) throw error

  return data[0].asset_id
}

export async function assetAttempt(
  supabase,
  asset_id,
  // worker_label
){
  const { data, error } = await supabase
    .from('attempt')
    .insert([
      {
        'asset_id': asset_id,
        // 'worker_label': worker_label
      },
    ])
    .select()

  if (error) throw error

  return data[0].asset_id
}

