export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
    // Create auth user via Supabase REST API
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        email_confirm: true
      })
    });
  
    const authData = await authResponse.json();
  
    if (!authResponse.ok) {
      throw createError({
        statusCode: 500,
        statusMessage: authData.message || 'Failed to create user',
      });
    }
  
    // Create profile via REST API
    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        id: authData.id,
        email: body.email,
        role: body.role,
        banned: false
      })
    });
  
    if (!profileResponse.ok) {
      const profileError = await profileResponse.json();
      throw createError({
        statusCode: 500,
        statusMessage: profileError.message || 'Failed to create profile',
      });
    }
  
    return { success: true };
  });