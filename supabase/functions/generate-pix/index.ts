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
    // --- INÍCIO DO TESTE DE CONECTIVIDADE ---
    console.log('Tentando fetch de diagnóstico para jsonplaceholder...');
    try {
      const diagnosticResponse = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      if (diagnosticResponse.ok) {
        const diagnosticData = await diagnosticResponse.json();
        console.log('Fetch de diagnóstico bem-sucedido:', diagnosticData);
      } else {
        console.error('Fetch de diagnóstico falhou:', diagnosticResponse.status, await diagnosticResponse.text());
      }
    } catch (diagError: any) {
      console.error('Fetch de diagnóstico lançou um erro:', diagError.message);
    }
    console.log('Fetch de diagnóstico concluído.');
    // --- FIM DO TESTE DE CONECTIVIDADE ---

    const { userSlug, userName, userEmail } = await req.json();

    if (!userSlug || !userName || !userEmail) {
      return new Response(JSON.stringify({ error: 'Missing userSlug, userName, or userEmail' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // IMPORTANT: For production, move this key to Supabase Secrets and access via Deno.env.get()
    const BSPAY_AUTH_KEY = 'Basic aXNhcXVlcmVpc183ODA3MjgzNTEyOjNhZWI1Mzg5NDQ5Yzg1M2YzYmFkNmJmNzBlZmFlMDBmNjhiZWUzNjg0MjdlYTdhZWEwNTY1OTk2ZmY0OWUxYmY=';
    const BSPAY_API_BASE_URL = 'https://api.bspay.co/v2';

    // 1. Get Access Token
    console.log(`Buscando token em: ${BSPAY_API_BASE_URL}/oauth/token`);
    const tokenResponse = await fetch(`${BSPAY_API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': BSPAY_AUTH_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('BSPay Token Error (raw):', errorText);
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        // Se não for JSON, mantém o texto bruto
      }
      throw new Error(`Failed to get BSPay token: ${tokenResponse.statusText}. Details: ${JSON.stringify(errorData || errorText)}`);
    }

    const { access_token } = await tokenResponse.json();
    console.log('Token de acesso BSPay obtido com sucesso.');

    // 2. Generate Pix QR Code
    console.log(`Gerando QR Code Pix para o usuário: ${userSlug}`);
    const generatedCpf = generateValidCpf(); // Generate a random valid CPF
    const pixQrCodePayload = {
      amount: "3", // Alterado para "3" para testes
      external_id: userSlug, // Mantido como userSlug para compatibilidade com o webhook
      payerQuestion: "",
      payer: {
        name: userName,
        document: generatedCpf,
        email: userEmail,
      },
      postbackUrl: "https://webhook.site/657df57d-40c8-45ba-84e0-653903ef5a38", // URL do webhook.site
    };

    const pixQrCodeResponse = await fetch(`${BSPAY_API_BASE_URL}/pix/qrcode`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json', // Adicionado cabeçalho Accept
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pixQrCodePayload),
    });

    if (!pixQrCodeResponse.ok) {
      const errorText = await pixQrCodeResponse.text();
      console.error('BSPay Pix QR Code Error (raw):', errorText);
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        // Se não for JSON, mantém o texto bruto
      }
      throw new Error(`Failed to generate Pix QR Code: ${pixQrCodeResponse.statusText}. Details: ${JSON.stringify(errorData || errorText)}`);
    }

    const pixData = await pixQrCodeResponse.json();
    console.log('Resposta completa da BSPay para Pix QR Code:', pixData);

    const brCode = pixData.qrcode; // Mapeia 'qrcode' da BSPay para 'brCode'
    let qrCodeUrl = null;

    if (brCode) {
      // Gera uma URL de imagem para o QR Code a partir do BR Code
      qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(brCode)}`;
    }

    console.log('QR Code Pix gerado com sucesso.');
    console.log('Retornando dados Pix:', { brCode, qrCodeUrl });

    return new Response(JSON.stringify({ brCode, qrCodeUrl }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Edge Function Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});