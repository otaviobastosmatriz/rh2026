import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { showError } from '@/utils/toast';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Carregando Perfil...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <a href="/" className="text-blue-500 hover:text-blue-700 underline mt-4 block">
              Voltar para a página inicial
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Usuário Não Encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>O perfil com a slug "{slug}" não foi encontrado.</p>
            <a href="/" className="text-blue-500 hover:text-blue-700 underline mt-4 block">
              Voltar para a página inicial
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-lg font-medium">Nome:</p>
            <p className="text-xl font-semibold text-primary">{user.name}</p>
          </div>
          <div>
            <p className="text-lg font-medium">Email:</p>
            <p className="text-xl font-semibold text-primary">{user.email}</p>
          </div>
          <div>
            <p className="text-lg font-medium">Slug:</p>
            <p className="text-xl font-semibold text-primary">{user.slug}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;