import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const client = await serverSupabaseClient(event);

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', body.user_id)
    .single();

  if (error) {
    return null;
  }

  return data;
});