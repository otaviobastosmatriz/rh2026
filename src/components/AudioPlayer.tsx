import React from 'react';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  return (
    <div className="w-full">
      <audio controls controlsList="nodownload" className="w-full">
        <source src={src} type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
    </div>
  );
};

export default AudioPlayer;