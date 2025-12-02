import React from 'react';
import HelioCoutoLogo from './HelioCoutoLogo'; // Importar o novo componente

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 flex justify-center items-center z-10">
      <HelioCoutoLogo /> {/* Usar o componente do logo */}
    </header>
  );
};

export default Header;