"use client";

import React, { useEffect, useRef } from 'react';
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
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Função para renderizar o estado inicial (botão de play)
  const renderInitial = (container: HTMLDivElement) => {
    if (!container) return;

    container.innerHTML =
      '<button type="button" class="play-button">Assistir vídeo</button>';

    const btn = container.querySelector(".play-button");
    if (!btn) return;

    const clickHandler = () => {
      const src =
        `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&fs=0&disablekb=1`;

      container.innerHTML =
        '<div class="video-inner" style="position:relative;width:100%;height:100%;">' +
          '<iframe class="yt-protected-iframe" ' +
            `src="${src}" ` +
            'title="Video" ' +
            'frameborder="0" ' +
            'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture">' +
          '</iframe>' +
          '<div class="block-overlay"></div>' +
          '<div class="loading-overlay">' +
            '<div class="loader-circle"></div>' +
            '<div class="loading-text">Carregando vídeo...</div>' +
          '</div>' +
        '</div>';

      setTimeout(() => {
        const loading = container.querySelector(".loading-overlay");
        if (loading) loading.remove();
      }, 6000);

      btn.removeEventListener("click", clickHandler); // Remover listener após o clique
    };

    btn.addEventListener("click", clickHandler);
  };

  // Efeito para lidar com o ciclo de vida do player de vídeo e proteções globais
  useEffect(() => {
    if (isOpen) {
      // Listeners de eventos globais para proteção
      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
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
        }
      };

      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);

      if (videoContainerRef.current) {
        renderInitial(videoContainerRef.current);
      }

      return () => {
        // Limpeza
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
        if (videoContainerRef.current) {
          videoContainerRef.current.innerHTML = ''; // Limpar conteúdo ao fechar
        }
      };
    }
  }, [isOpen, videoId]); // Re-executar efeito se o modal abrir ou o videoId mudar

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
            id="bubble-video-1" // Manter o ID conforme o script original
            className={cn(
              "video-wrapper yt-protected-container",
              // Aplicar user-select diretamente ao wrapper e seus filhos para melhor escopo
              "select-none" // Tailwind class for user-select: none
            )}
            ref={videoContainerRef}
            data-video-id={videoId}
          >
            {/* O player de vídeo será injetado aqui pelo JS */}
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