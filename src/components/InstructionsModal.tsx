"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-heliopurple text-2xl font-bold text-center">
            Veja abaixo as instruções de como usar sua RH.
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-700 dark:text-gray-300 space-y-4 text-left">
          <p>
            Para utilizar a Ressonância Portal 2026 de forma prática e efetiva, siga atentamente as orientações abaixo. Esta frequência foi criada para abrir seu campo e preparar você para um 2026 de prosperidade, riqueza, saúde e felicidade.
          </p>

          <div>
            <strong className="text-heliopurple">1. Assista ao Vídeo Explicativo</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Antes de ouvir o áudio, assista ao vídeo enviado com seu link. Nele, o Professor Hélio Couto explica a importância da RH Portal 2026 e como ela age no seu campo vibracional.</li>
            </ul>
          </div>

          <div>
            <strong className="text-heliopurple">2. Como Ouvir a Ressonância</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Basta dar play no áudio no link enviado ao seu e-mail. Não é necessário nenhum ritual, posição ou preparação especial.</li>
              <li>Use fones de ouvido se desejar, mas não é obrigatório.</li>
            </ul>
          </div>

          <div>
            <strong className="text-heliopurple">3. Frequência + Reprogramação Mental</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Esta RH possui uma frequência energética especial combinada com uma reprogramação mental embutida no áudio.</li>
              <li>Essa reprogramração auxilia na quebra de crenças limitantes e na intensificação da mente para manifestar prosperidade em 2026.</li>
            </ul>
          </div>

          <div>
            <strong className="text-heliopurple">4. Frequência de Audição</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Ouça a Ressonância uma vez por dia. Uma única reprodução diária é suficiente para que a informação seja inserida no campo.</li>
            </ul>
          </div>

          <div>
            <strong className="text-heliopurple">5. Caso Esqueça de Ouvir</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Se esquecer algum dia, não se preocupe. Retome no dia seguinte normalmente.</li>
            </ul>
          </div>

          <div>
            <strong className="text-heliopurple">6. Sem Necessidade de Entender o Conteúdo</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Não é necessário compreender conscientemente o conteúdo do áudio. A informação atua no campo vibracional automaticamente.</li>
              <li>Você pode deixar o áudio no volume zero, se desejar.</li>
            </ul>
          </div>

          <div>
            <strong className="text-heliopurple">7. Consistência</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>O mais importante é manter a regularidade. A prática diária permite que a frequência se estabilize em seu campo.</li>
            </ul>
          </div>

          <div>
            <strong className="text-heliopurple">8. Pagamento Somente Pelo Link</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>O pagamento da RH Portal 2026 deve ser feito apenas pelo botão dentro da página do link que você recebeu.</li>
              <li>Não existe chave Pix ou outra forma de pagamento. Somente pelo link o sistema identifica o pagamento.</li>
            </ul>
          </div>

          <div>
            <strong className="text-heliopurple">9. Valor Simbólico</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>A taxa da RH Portal 2026 é simbólica — apenas R$48. Ela representa o compromisso energético necessário para que o processo se instale corretamente.</li>
            </ul>
          </div>

          <div>
            <strong className="text-heliopurple">10. Permita o Processo</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Entre em estado de aceitação. Não resista, não questione, não crie expectativas imediatas. A frequência se alinhará ao seu campo naturalmente.</li>
            </ul>
          </div>

          <div>
            <strong className="text-heliopurple">11. Se Precisar de Ajuda</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Em caso de dúvidas ou problemas com o link, envie e-mail para: divulgacao@ressonanteharmonica.com</li>
            </ul>
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose} className="bg-heliopurple hover:bg-heliopurple-light text-white">
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsModal;