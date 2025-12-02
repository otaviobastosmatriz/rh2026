import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('BSPay Webhook received:', payload);

    // Extract relevant information from the webhook payload
    const externalId = payload.external_id; // This should be the user's slug
    const status = payload.status; // e.g., 'PAID', 'PENDING', 'CANCELED'

    if (!externalId || !status) {
      return new Response(JSON.stringify({ error: 'Missing external_id or status in webhook payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client with service role key for server-side updates
    // IMPORTANT: SUPABASE_SERVICE_ROLE_KEY must be set as a Supabase Secret for this Edge Function
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (status === 'PAID') { // Assuming 'PAID' is the status for confirmed payment
      const { data, error } = await supabase
        .from('users')
        .update({ status: true })
        .eq('slug', externalId);

      if (error) {
        console.error('Error updating user status in Supabase:', error);
        throw new Error(`Failed to update user status: ${error.message}`);
      }
      console.log(`User ${externalId} status updated to TRUE.`);
    } else {
      console.log(`Payment status for ${externalId} is ${status}, no update needed.`);
    }

    return new Response(JSON.stringify({ message: 'Webhook processed successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('BSPay Webhook Edge Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});