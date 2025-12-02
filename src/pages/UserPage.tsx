import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { showError } from '@/utils/toast';
import Header from '@/components/Header';
// import SocialLinks from '@/components/SocialLinks'; // Removido
import AudioPlayer from '@/components/AudioPlayer';
import { Button } from '@/components/ui/button';
import { FileText, Link, User, Mail, CircleAlert } from 'lucide-react'; // Adicionado CircleAlert para o aviso

interface UserProfile {
  slug: string;
  name: string;
  email: string;
}

const UserPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("UserPage está renderizando para slug:", slug);

  useEffect(() => {
    const fetchUser = async () => {
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
          .select('name, email, slug')
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
    };

    fetchUser();
  }, [slug]);

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

  const handleCopyLink = () => {
    const linkToCopy = `https://ressonanciaharmonica.com.br/129652/${slug}`; // Usando o slug real
    navigator.clipboard.writeText(linkToCopy)
      .then(() => showError('Link copiado para a área de transferência!')) // Usando showError para notificação
      .catch(err => console.error('Falha ao copiar o link:', err));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start relative pt-20 pb-8 px-4">
      <Header />
      <Card className="w-full max-w-3xl mx-auto p-8 lg:p-12 bg-white rounded-lg shadow-lg z-0 mt-8">
        <CardContent className="p-0">
          <h2 className="text-heliopurple text-center font-bold text-2xl mb-2">Seja bem-vindo (a)</h2>
          <p className="text-center text-gray-700 font-semibold mb-6">
            Siga o <span className="text-heliopurple">Professor Hélio Couto</span> nas redes sociais:
          </p>

          <div className="flex flex-col items-center justify-center mb-8"> {/* Ajustado para centralizar a imagem */}
            <div className="text-center p-5 flex-shrink-0">
              <img
                className="img-fluid rounded-full border-4 border-heliopurple w-40 h-40 object-cover mx-auto"
                src="/images/heliocouto.webp"
                alt="Professor Hélio Couto"
              />
            </div>
            {/* <div className="flex-1 w-full max-w-xs lg:max-w-none">
              <SocialLinks />
            </div> */} {/* SocialLinks removido */}
          </div>

          <hr className="border-heliopurple my-8" />

          <h3 className="text-heliopurple text-center font-bold text-2xl mb-4">Áudio</h3>
          <AudioPlayer src="https://cdn.ressonanciaharmonica.com.br/assets/audio/3beed790b3e35dd4a4f543d5776e7712.mp3" />

          <div className="flex items-center justify-center text-orange-600 bg-orange-50 border border-orange-300 rounded-md p-3 mt-6 mb-8">
            <CircleAlert className="h-5 w-5 mr-2 text-red-500" /> {/* Ícone de alerta */}
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
            <a href={`https://ressonanciaharmonica.com.br/download/5a8e66b9/${slug}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button className="bg-heliopurple hover:bg-heliopurple-light text-white px-6 py-3 rounded-md flex items-center justify-center w-full">
                <FileText className="h-5 w-5 mr-2" /> Manual da RH
              </Button>
            </a>
            <Button onClick={handleCopyLink} className="bg-heliopurple hover:bg-heliopurple-light text-white px-6 py-3 rounded-md flex items-center justify-center w-full">
              <Link className="h-5 w-5 mr-2" /> Copiar o link da minha RH
            </Button>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-gray-600 text-sm pb-8">
        <p className="text-white">&copy; Hélio Couto 2025 | Todos os direitos reservados | <a href="https://ressonanciaharmonica.com.br/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Política de privacidade</a></p>
      </footer>
    </div>
  );
};

export default UserPage;