import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { showError } from '@/utils/toast';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';
import { Button } from '@/components/ui/button';
import { FileText, Link, User, Mail, CircleAlert, Video, Check } from 'lucide-react';
import InstructionsModal from '@/components/InstructionsModal';
import VideoModal from '@/components/VideoModal';
import PixPaymentModal from '@/components/PixPaymentModal'; // Importar o novo modal

interface UserProfile {
  slug: string;
  name: string;
  email: string;
  status: boolean;
}

const UserPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPixPaymentModal, setShowPixPaymentModal] = useState(false); // Estado para o modal Pix

  console.log("UserPage está renderizando para slug:", slug);

  const fetchUser = useCallback(async () => {
    if (!slug) {
      setError("Slug do usuário não fornecido na URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, email, slug, status')
        .eq('slug', slug)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setUser(data);
      } else {
        setError("Usuário não encontrado.");
      }
    } catch (err: any) {
      console.error("Erro ao buscar usuário:", err.message);
      showError(`Erro ao carregar perfil: ${err.message}`);
      setError("Não foi possível carregar o perfil do usuário.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleCopyLink = () => {
    const linkToCopy = `https://ressonanciaharmonica.com.br/129652/${slug}`;
    navigator.clipboard.writeText(linkToCopy)
      .then(() => showError('Link copiado para a área de transferência!'))
      .catch(err => console.error('Falha ao copiar o link:', err));
  };

  const handlePaymentClick = () => {
    setShowPixPaymentModal(true); // Abre o modal Pix
  };

  const handlePixModalClose = () => {
    setShowPixPaymentModal(false);
  };

  const handlePaymentConfirmed = () => {
    fetchUser(); // Recarrega os dados do usuário para atualizar o status
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Header />
        <Card className="w-full max-w-3xl mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-heliopurple text-center text-2xl font-bold mb-4">Carregando Perfil...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-full mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Header />
        <Card className="w-full max-w-3xl mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-600 text-center text-2xl font-bold mb-4">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">{error}</p>
            <a href="/" className="text-blue-500 hover:text-blue-700 underline mt-4 block text-center">
              Voltar para a página inicial
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Header />
        <Card className="w-full max-w-3xl mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-heliopurple text-center text-2xl font-bold mb-4">Usuário Não Encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">O perfil com a slug "{slug}" não foi encontrado.</p>
            <a href="/" className="text-blue-500 hover:text-blue-700 underline mt-4 block text-center">
              Voltar para a página inicial
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start relative pt-20 pb-8 px-4">
      <Header />
      <Card className="w-full max-w-3xl mx-auto p-8 lg:p-12 bg-white rounded-lg shadow-lg z-0 mt-8">
        <CardContent className="p-0">
          <h2 className="text-heliopurple text-center font-bold text-2xl mb-2">Seja bem-vindo (a)</h2>
          <p className="text-center text-gray-700 font-semibold mb-1">
            Abaixo está disponível sua Ressonância Portal 2026
          </p>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            A Ressonância Harmônica – Portal 2026 ajusta sua vibração em dezembro para que você entre em 2026 alinhado à prosperidade, saúde, riqueza e felicidade. Uma onda extra feita para abrir seu campo para um novo ciclo.
          </p>

          <div className="flex flex-col items-center justify-center mb-8">
            <div className="text-center p-5 flex-shrink-0">
              <img
                className="img-fluid rounded-full border-4 border-heliopurple w-40 h-40 object-cover mx-auto"
                src="/images/heliocouto.webp" // Caminho da imagem atualizado para .webp
                alt="Professor Hélio Couto"
              />
            </div>
          </div>

          <hr className="border-heliopurple my-8" />

          <h3 className="text-heliopurple text-center font-bold text-2xl mb-4">Áudio</h3>
          <AudioPlayer src="https://cdn.ressonanciaharmonica.com.br/assets/audio/3beed790b3e35dd4a4f543d5776e7712.mp3" />

          {/* Bloco de Pagamento Pendente */}
          {!user.status && (
            <div className="border border-red-300 rounded-md p-6 mt-8 mb-8 bg-red-50 text-center">
              <h4 className="text-red-700 font-bold text-lg mb-3">PAGAMENTO PENDENTE</h4>
              <p className="text-gray-700 mb-4">
                Efetue o pagamento para que sua Ressonância se mantenha funcionando. Aperte no botão abaixo
                para gerar seu pagamento:
              </p>
              <Button
                onClick={handlePaymentClick}
                className="bg-heliopurple hover:bg-heliopurple-light text-white px-6 py-3 rounded-md flex items-center justify-center mx-auto"
              >
                <Check className="h-5 w-5 mr-2" /> EFETUAR PAGAMENTO
              </Button>
            </div>
          )}

          <div className="flex items-center justify-center text-red-700 bg-red-50 border border-red-300 rounded-md p-3 mt-6 mb-8">
            <CircleAlert className="h-5 w-5 mr-2 text-red-500" />
            <p className="text-sm text-center font-bold">Atenção: o link desta página é pessoal e não deve ser compartilhado com outras pessoas</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-sm text-gray-500 flex items-center mb-1">
                <User className="h-4 w-4 mr-2 text-heliopurple" /> <span className="font-bold text-heliopurple uppercase">Nome</span>
              </p>
              <p className="text-lg font-semibold text-gray-800">{user.name}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-sm text-gray-500 flex items-center mb-1">
                <Mail className="h-4 w-4 mr-2 text-heliopurple" /> <span className="font-bold text-heliopurple uppercase">E-mail</span>
              </p>
              <p className="text-lg font-semibold text-gray-800">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-5">
            <Button
              onClick={() => setShowInstructionsModal(true)}
              className="bg-heliopurple hover:bg-heliopurple-light text-white px-6 py-3 rounded-md flex items-center justify-center w-full sm:w-auto"
            >
              <FileText className="h-5 w-5 mr-2" /> Instruções da RH
            </Button>
            <Button
              onClick={() => setShowVideoModal(true)}
              className="bg-heliopurple hover:bg-heliopurple-light text-white px-6 py-3 rounded-md flex items-center justify-center w-full sm:w-auto"
            >
              <Video className="h-5 w-5 mr-2" /> Vídeo RH Portal 2026
            </Button>
            <Button onClick={handleCopyLink} className="bg-heliopurple hover:bg-heliopurple-light text-white px-6 py-3 rounded-md flex items-center justify-center w-full">
              <Link className="h-5 w-5 mr-2" /> Copiar o link da minha RH
            </Button>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-gray-600 text-sm pb-8">
        <p className="text-white">&copy; Hélio Couto 2025 | Todos os direitos reservados | <a href="https://ressonanciaharmonica.com.br/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Política de privacidade</a></p>
      </footer>

      <InstructionsModal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
      />
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoId="L4_Igd6Q9Oo"
      />
      {user && (
        <PixPaymentModal
          isOpen={showPixPaymentModal}
          onClose={handlePixModalClose}
          userSlug={user.slug}
          userName={user.name}
          userEmail={user.email}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}
    </div>
  );
};

export default UserPage;