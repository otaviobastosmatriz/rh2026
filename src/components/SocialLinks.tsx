import React from 'react';
import { Globe, Coffee, Instagram, Facebook, Linkedin, Send, Music } from 'lucide-react'; // Alterado Spotify para Music
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
    { icon: Globe, label: 'Site', href: 'https://heliocouto.com' },
    { icon: Coffee, label: 'Cursos', href: 'https://cursosheliocouto.com.br' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/helio.couto' },
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/heliocouto' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/heliocoutorh/' },
    { icon: Send, label: 'Telegram', href: 'https://t.me/heliocouto' },
    { icon: Music, label: 'Spotify', href: 'https://open.spotify.com/artist/5og9v0exhkpYUSdE3Xlfmm?si=Q3Q4-NCOS5GSRKq5HXtogQ' }, // Usando Music como substituto
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