import React from 'react';
import { Globe, Coffee, Instagram, Facebook, Linkedin, Send } from 'lucide-react'; // Removido Spotify
import { Button } from '@/components/ui/button';

interface SocialLinkProps {
  icon: React.ElementType;
  label: string;
  href: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon: Icon, label, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-full">
    <Button variant="outline" className="w-full justify-start text-heliopurple border-heliopurple hover:bg-heliopurple hover:text-white transition-colors duration-200">
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  </a>
);

const SocialLinks = () => {
  const links = [
    { icon: Globe, label: 'Site', href: 'https://ressonanciaharmonica.com.br/' },
    { icon: Coffee, label: 'Cursos', href: 'https://ressonanciaharmonica.com.br/cursos/' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/heliocouto_oficial/' },
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/heliocoutooficial' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/helio-couto-oficial/' },
    { icon: Send, label: 'Telegram', href: 'https://t.me/heliocoutooficial' },
    // { icon: Spotify, label: 'Spotify', href: 'https://open.spotify.com/artist/0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z' }, // Removido o link do Spotify
  ];

  return (
    <div className="grid grid-cols-1 gap-2">
      {links.map((link, index) => (
        <SocialLink key={index} {...link} />
      ))}
    </div>
  );
};

export default SocialLinks;