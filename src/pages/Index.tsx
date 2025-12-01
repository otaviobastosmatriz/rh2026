import { MadeWithDyad } from "@/components/made-with-dyad";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [slugInput, setSlugInput] = useState('');
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (slugInput.trim()) {
      navigate(`/${slugInput.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Bem-vindo ao Seu Aplicativo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
            Digite uma slug de usuário para ver o perfil:
          </p>
          <div className="flex w-full max-w-sm items-center space-x-2 mx-auto">
            <Input
              type="text"
              placeholder="Ex: william-silva-gomes"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleNavigate();
                }
              }}
            />
            <Button onClick={handleNavigate}>Ver Perfil</Button>
          </div>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default Index;