import React from 'react';
import { User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HelioCoutoLogo from './HelioCoutoLogo'; // Importar o novo componente

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
      <HelioCoutoLogo /> {/* Usar o componente do logo */}
      <div className="flex space-x-2">
        <Button className="bg-heliopurple hover:bg-heliopurple-light text-white rounded-full w-10 h-10 p-0 flex items-center justify-center">
          <User className="h-5 w-5" />
        </Button>
        <Button className="bg-heliopurple hover:bg-heliopurple-light text-white rounded-full w-10 h-10 p-0 flex items-center justify-center">
          <Mail className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;