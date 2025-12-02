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
  onPaymentConfirmed: () => void; // Callback para quando o pagamento for confirmado
}

const PIX_CODE_PLACEHOLDER = "00020126580014BR.GOV.BCB.PIX0136a342142d-2d3b-4c5d-9e0a-1b2c3d4e5f60520400005303986540648.005802BR5925NOME DO RECEBEDOR LTDA6008BRASILIA62070503***6304B167";
const PIX_VALUE = "R$48,00";
const PIX_EXPIRATION_SECONDS = 600; // 10 minutos

const PixPaymentModal: React.FC<PixPaymentModalProps> = ({ isOpen, onClose, userSlug, onPaymentConfirmed }) => {
  const [pixCode, setPixCode] = useState(PIX_CODE_PLACEHOLDER);
  const [timeLeft, setTimeLeft] = useState(PIX_EXPIRATION_SECONDS);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setTimeLeft(PIX_EXPIRATION_SECONDS); // Reset timer when modal opens
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
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
      .then(() => showSuccess('Código Pix copiado para a área de transferência!'))
      .catch(err => showError('Falha ao copiar o código Pix.'));
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
        </DialogHeader>
        <DialogDescription className="text-gray-700 dark:text-gray-300 space-y-4 text-left">
          <div className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Seu código PIX expira em <span className="text-red-600">{formatTime(timeLeft)}</span>
          </div>

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
        </DialogDescription>
        <DialogFooter className="flex flex-col gap-2 mt-6">
          <Button
            onClick={handleCheckPayment}
            disabled={isCheckingPayment}
            className="bg-heliopurple hover:bg-heliopurple-light text-white w-full"
          >
            {isCheckingPayment ? 'Verificando pagamento...' : 'Já efetuou o pagamento? Aperte aqui.'}
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Pagamento processado por NunoPay
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PixPaymentModal;