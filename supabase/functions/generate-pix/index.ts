import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to generate a valid CPF (for testing purposes)
function generateValidCpf(): string {
  function randomDigit() {
    return Math.floor(Math.random() * 10);
  }

  function calculateVerifierDigit(cpfBase: number[]): number {
    let sum = 0;
    let multiplier = cpfBase.length + 1;
    for (let i = 0; i < cpfBase.length; i++) {
      sum += cpfBase[i] * multiplier;
      multiplier--;
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  let cpf = Array.from({ length: 9 }, () => randomDigit());

  let d1 = calculateVerifierDigit(cpf);
  cpf.push(d1);

  let d2 = calculateVerifierDigit(cpf);
  cpf.push(d2);

  return cpf.join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userSlug, userName, userEmail } = await req.json();

    if (!userSlug || !userName || !userEmail) {
      return new Response(JSON.stringify({ error: 'Missing userSlug, userName, or userEmail' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // IMPORTANT: For production, move this key to Supabase Secrets and access via Deno.env.get()
    const BSPAY_AUTH_KEY = 'Basic aXNhcXVlcmVpc183ODA3MjgzNTEyOjNhZWI1Mzg5NDQ5Yzg1M2YzYmFkNmJmNzBlZmFlMDBmNjhiZWUzNjg0MjdlYTdhZWEwNTY1OTk2ZmY0OWUxYmY=';
    const BSPAY_API_BASE_URL = 'https://api.bspay.io/v1';

    // 1. Get Access Token
    const tokenResponse = await fetch(`${BSPAY_API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Authorization': BSPAY_AUTH_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text(); // Captura o texto bruto da resposta
      console.error('BSPay Token Error (raw):', errorText);
      let errorData = {};
      try {
        errorData = JSON.parse(errorText); // Tenta parsear como JSON se for válido
      } catch (e) {
        // Se não for JSON, mantém o texto bruto
      }
      throw new Error(`Failed to get BSPay token: ${tokenResponse.statusText}. Details: ${JSON.stringify(errorData || errorText)}`);
    }

    const { access_token } = await tokenResponse.json();

    // 2. Generate Pix Charge
    const generatedCpf = generateValidCpf(); // Generate a random valid CPF
    const pixChargePayload = {
      amount: 4800, // R$48.00 in cents
      external_id: userSlug, // Use user slug to identify the payment
      payer: {
        name: userName,
        email: userEmail,
        document: generatedCpf,
      },
      description: "Ressonância Harmônica - Portal 2026",
      expires_in: 600, // 10 minutes
    };

    const pixChargeResponse = await fetch(`${BSPAY_API_BASE_URL}/pix/charge`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pixChargePayload),
    });

    if (!pixChargeResponse.ok) {
      const errorText = await pixChargeResponse.text(); // Captura o texto bruto da resposta
      console.error('BSPay Pix Charge Error (raw):', errorText);
      let errorData = {};
      try {
        errorData = JSON.parse(errorText); // Tenta parsear como JSON se for válido
      } catch (e) {
        // Se não for JSON, mantém o texto bruto
      }
      throw new Error(`Failed to generate Pix charge: ${pixChargeResponse.statusText}. Details: ${JSON.stringify(errorData || errorText)}`);
    }

    const pixData = await pixChargeResponse.json();
    const { brCode, qrCodeUrl } = pixData;

    return new Response(JSON.stringify({ brCode, qrCodeUrl }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});