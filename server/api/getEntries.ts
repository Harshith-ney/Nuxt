import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const client = await serverSupabaseClient(event);

  let query = client.from('entries').select('*');

  // If basic user, only show their entries
  if (body.role !== 'admin') {
    query = query.eq('user_id', body.user_id);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return data;
});