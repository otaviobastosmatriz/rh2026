"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Importar cn para usar classes Tailwind

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string; // Prop para o ID do vídeo do YouTube
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoId }) => {
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  // Efeito para lidar com o ciclo de vida do player de vídeo e proteções globais
  useEffect(() => {
    if (isOpen) {
      console.log("VideoModal useEffect: Modal está aberto, configurando proteções e resetando estado.");
      // Resetar o estado quando o modal abre, para garantir que o botão de play apareça
      setShowPlayButton(true);
      setShowLoadingOverlay(false);

      // Listeners de eventos globais para proteção
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        console.log("VideoModal: Menu de contexto bloqueado.");
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === "PrintScreen" ||
          (e.ctrlKey && e.key.toLowerCase() === "u") ||
          (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
          (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") ||
          (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") ||
          (e.ctrlKey && e.key.toLowerCase() === "s")
        ) {
          e.preventDefault();
          e.stopPropagation();
          console.log("VideoModal: Atalho de teclado bloqueado:", e.key);
        }
      };

      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        console.log("VideoModal useEffect: Modal está fechando ou desmontando, limpando listeners.");
        // Limpeza: remove listeners
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      console.log("VideoModal useEffect: Modal está fechado, nenhuma ação necessária do useEffect.");
    }
  }, [isOpen]); // Re-executar efeito se o modal abrir ou fechar

  const handlePlayClick = () => {
    console.log("VideoModal: Botão de play clicado, carregando iframe.");
    setShowPlayButton(false);
    setShowLoadingOverlay(true);

    // Remove a tela de "Carregando vídeo" depois de 6s
    setTimeout(() => {
      setShowLoadingOverlay(false);
      console.log("VideoModal: Overlay de carregamento removido após 6 segundos.");
    }, 6000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-heliopurple text-2xl font-bold text-center">
            Vídeo RH Portal 2026
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-4">
          <div
            className={cn(
              "video-wrapper yt-protected-container",
              "select-none" // Tailwind class for user-select: none
            )}
          >
            {showPlayButton ? (
              <button type="button" className="play-button" onClick={handlePlayClick}>
                Assistir vídeo
              </button>
            ) : (
              <div className="video-inner" style={{ position: 'relative', width: '100%', height: '100%' }}>
                <iframe
                  className="yt-protected-iframe"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&fs=0&disablekb=1`}
                  title="Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
                <div className="block-overlay"></div>
                {showLoadingOverlay && (
                  <div className="loading-overlay">
                    <div className="loader-circle"></div>
                    <div className="loading-text">Carregando vídeo...</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="p-6 pt-0">
          <Button onClick={onClose} className="bg-heliopurple hover:bg-heliopurple-light text-white">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
      {/* Incorporar os estilos diretamente para este componente */}
      <style>{`
        .video-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
          overflow: hidden;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .play-button {
          padding: 12px 24px;
          border-radius: 999px;
          border: none;
          font-size: 16px;
          font-weight: bold;
          background: #7e0c6e;
          color: #fff;
          cursor: pointer;
        }

        .play-button:hover {
          opacity: 0.9;
        }

        .yt-protected-iframe {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }

        /* Overlay transparente que bloqueia todos os cliques no player */
        .block-overlay {
          position: absolute;
          inset: 0;
          cursor: default;
          z-index: 900;
        }

        /* Tela de "Carregando vídeo..." */
        .loading-overlay {
          position: absolute;
          inset: 0;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          z-index: 1000;
          color: #fff;
          font-size: 14px;
          text-align: center;
          padding: 0 16px;
        }

        .loading-text {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .loader-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid #555;
          border-top-color: #ffffff;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Dialog>
  );
};

export default VideoModal;