import { serverSupabaseClient } from "#supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

// example of how to get data from supabase though Nuxt's server API
//     notice how we need to use a different client

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const client = await serverSupabaseClient(event);
  const { data, error } = await getTableData(client, body);
  //   const { data, error } = await getStorageUrl(client, body);
  if (error && error.message) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
  return data;
});

async function getTableData(client: SupabaseClient, body: any) {
  const { data, error } = await client.from(body.table).select("*");
  return { data, error };
}

async function getStorageUrl(client: SupabaseClient, body: any) {
  const { data, error } = await client.storage
    .from(body.bucket)
    .createSignedUrl(body.fileName, 300);
  return { data, error };
}
