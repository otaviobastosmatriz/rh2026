import React from 'react';
import { User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 flex justify-end items-center z-10">
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" className="bg-heliopurple hover:bg-heliopurple-light text-white rounded-full w-10 h-10">
          <User className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="bg-heliopurple hover:bg-heliopurple-light text-white rounded-full w-10 h-10">
          <Mail className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;