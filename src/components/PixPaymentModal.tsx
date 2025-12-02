"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, CircleCheck } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { supabase } from '@/lib/supabase';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSlug: string;
  userName: string; // Adicionado
  userEmail: string; // Adicionado
  onPaymentConfirmed: () => void; // Callback para quando o pagamento for confirmado
}

const PIX_VALUE = "R$48,00";
const PIX_EXPIRATION_SECONDS = 600; // 10 minutos

const PixPaymentModal: React.FC<PixPaymentModalProps> = ({ isOpen, onClose, userSlug, userName, userEmail, onPaymentConfirmed }) => {
  const [pixCode, setPixCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [timeLeft, setTimeLeft] = useState(PIX_EXPIRATION_SECONDS);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setTimeLeft(PIX_EXPIRATION_SECONDS); // Reset timer when modal opens
      setPixCode(''); // Clear previous Pix code
      setQrCodeUrl(''); // Clear previous QR code
      setIsGeneratingPix(true);

      // Call Edge Function to generate Pix
      const generatePix = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('generate-pix', {
            body: { userSlug, userName, userEmail },
          });

          // --- INÍCIO DOS LOGS DE DEPURÇÃO ---
          console.log("Resposta da Edge Function (data):", data);
          console.log("Resposta da Edge Function (error):", error);
          // --- FIM DOS LOGS DE DEPURÇÃO ---

          if (error) {
            throw error;
          }

          if (data && data.brCode && data.qrCodeUrl) {
            setPixCode(data.brCode);
            setQrCodeUrl(data.qrCodeUrl);
            showSuccess('Código Pix gerado com sucesso!');
          } else {
            // Este else será acionado se 'data' for null/undefined ou se 'brCode'/'qrCodeUrl' estiverem faltando
            console.error("Dados Pix incompletos recebidos:", data);
            showError('Falha ao gerar o código Pix. Dados incompletos.');
          }
        } catch (err: any) {
          console.error("Erro ao gerar Pix no frontend:", err.message);
          showError('Erro ao gerar o código Pix.');
        } finally {
          setIsGeneratingPix(false);
        }
      };
      generatePix();

      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isOpen, userSlug, userName, userEmail]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopyPixCode = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode)
        .then(() => showSuccess('Código Pix copiado para a área de transferência!'))
        .catch(err => showError('Falha ao copiar o código Pix.'));
    } else {
      showError('Nenhum código Pix para copiar.');
    }
  };

  const handleCheckPayment = async () => {
    setIsCheckingPayment(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('status')
        .eq('slug', userSlug)
        .single();

      if (error) {
        throw error;
      }

      if (data && data.status) {
        showSuccess('Pagamento recebido com sucesso!');
        onPaymentConfirmed(); // Notifica o UserPage para recarregar os dados
        onClose(); // Fecha o modal
      } else {
        showError('Pagamento ainda não confirmado. Por favor, aguarde alguns instantes ou tente novamente.');
      }
    } catch (err: any) {
      console.error("Erro ao verificar pagamento:", err.message);
      showError('Erro ao verificar o status do pagamento.');
    } finally {
      setIsCheckingPayment(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Previne o fechamento do modal ao clicar fora ou pressionar ESC
      if (!open && isOpen) {
        showError("Por favor, confirme o pagamento ou aguarde a expiração do Pix.");
      } else {
        onClose(); // Permite fechar se o estado isOpen for false
      }
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-heliopurple text-2xl font-bold text-center">
            Efetue o pagamento da sua Ressonância Harmonica
          </DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-300 text-center">
            Siga as instruções abaixo para completar seu pagamento via Pix.
          </DialogDescription>
        </DialogHeader>
        {isGeneratingPix ? (
          <div className="text-center py-8">
            <div className="loader-circle mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Gerando código Pix...</p>
          </div>
        ) : (
          <div className="p-4 space-y-4"> {/* Conteúdo principal do modal em um div */}
            <div className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Seu código PIX expira em <span className="text-red-600">{formatTime(timeLeft)}</span>
            </div>

            {qrCodeUrl && (
              <div className="flex justify-center mb-4">
                <img src={qrCodeUrl} alt="QR Code Pix" className="w-48 h-48 border border-gray-300 rounded-md" />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Input
                type="text"
                value={pixCode}
                readOnly
                className="text-center font-mono text-sm bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
              <Button
                onClick={handleCopyPixCode}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                disabled={!pixCode}
              >
                <Copy className="h-4 w-4 mr-2" /> Copiar Código Pix
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              <p className="flex items-center text-heliopurple font-semibold">
                <CircleCheck className="h-5 w-5 mr-2" /> Siga as instruções para efetuar o pagamento via Pix
              </p>
              <ol className="list-decimal list-inside ml-4 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Aperte em "Copiar Código Pix"</li>
                <li>Abra o App do seu banco e entre na opção PIX</li>
                <li>Escolha a opção <span className="font-bold">Pagar Pix Copia e Cola</span></li>
                <li>Depois confirme o pagamento</li>
              </ol>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Aprovação leva no máximo 2 minutos
              </p>
            </div>

            <div className="text-center text-xl font-bold text-heliopurple mt-6">
              Valor Promocional do Pix: {PIX_VALUE}
            </div>
          </div>
        )}
        <DialogFooter className="flex flex-col gap-2 mt-6">
          <Button
            onClick={handleCheckPayment}
            disabled={isCheckingPayment || isGeneratingPix}
            className="bg-heliopurple hover:bg-heliopurple-light text-white w-full"
          >
            {isCheckingPayment ? 'Verificando pagamento...' : 'Já efetuou o pagamento? Aperte aqui.'}
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Pagamento processado por NunoPay
          </p>
        </DialogFooter>
      </DialogContent>
      <style>{`
        .loader-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid #555;
          border-top-color: #7e0c6e; /* Cor do tema */
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Dialog>
  );
};

export default PixPaymentModal;