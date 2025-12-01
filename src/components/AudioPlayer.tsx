import React from 'react';
import { Play, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const AudioPlayer = () => {
  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white">
      <Play className="h-6 w-6 text-heliopurple cursor-pointer" />
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        className="flex-grow"
        // Ajustando as classes para o slider para usar a cor heliopurple
        style={{ '--heliopurple': 'var(--heliopurple-DEFAULT)' } as React.CSSProperties}
        trackClassName="bg-heliopurple/20"
        rangeClassName="bg-heliopurple"
        thumbClassName="bg-heliopurple border-heliopurple"
      />
      <span className="text-sm text-gray-600">42:07</span>
      <Volume2 className="h-5 w-5 text-heliopurple" />
      <Slider
        defaultValue={[70]}
        max={100}
        step={1}
        className="w-20"
        // Ajustando as classes para o slider de volume
        style={{ '--heliopurple': 'var(--heliopurple-DEFAULT)' } as React.CSSProperties}
        trackClassName="bg-heliopurple/20"
        rangeClassName="bg-heliopurple"
        thumbClassName="bg-heliopurple border-heliopurple"
      />
    </div>
  );
};

export default AudioPlayer;