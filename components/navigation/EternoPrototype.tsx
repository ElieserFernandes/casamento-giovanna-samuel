"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlbumCover } from "@/components/cover/AlbumCover";
import { InitialScreen } from "@/components/intro/InitialScreen";
import { BookMode } from "@/components/book/BookMode";
import { StoryMode } from "@/components/story/StoryMode";
import { GalleryMode } from "@/components/gallery/GalleryMode";
import { album } from "@/data/album";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Stage = "initial" | "cover" | "album";

export function EternoPrototype() {
  const [stage, setStage] = useState<Stage>("initial");
  const [showGallery, setShowGallery] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed right-4 top-4 z-50 flex flex-wrap justify-end gap-2 sm:right-6">
        <a href="/fotos" className="rounded-full border border-[#C9A96E]/25 bg-[#A8CFC0]/70 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#3A3A3A]/75 shadow-sm backdrop-blur-md transition hover:bg-[#A8CFC0]">
          Enviar fotos
        </a>
        <a href="/recados" className="rounded-full border border-[#C9A96E]/25 bg-white/80 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#3A3A3A]/70 shadow-sm backdrop-blur-md transition hover:bg-[#A8CFC0]/45">
          Deixar recado
        </a>
        <a href="/admin" className="rounded-full border border-[#C9A96E]/25 bg-[#FAF8F3]/85 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#3A3A3A]/55 shadow-sm backdrop-blur-md transition hover:bg-white">
          Painel
        </a>
      </div>

      <AnimatePresence mode="wait">
        {stage === "initial" && (
          <motion.div key="initial" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <InitialScreen onStart={() => setStage("cover")} />
          </motion.div>
        )}

        {stage === "cover" && (
          <motion.div key="cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55 }}>
            <AlbumCover onOpen={() => setStage("album")} />
          </motion.div>
        )}

        {stage === "album" && (
          <motion.div key="album" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#C9A96E]/12 bg-[#FAF8F3]/76 px-5 py-3 backdrop-blur-xl lg:px-10">
              <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 pt-16 sm:pt-0">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full border border-[#C9A96E]/30 bg-white/45 font-title text-sm tracking-[0.16em] text-[#C9A96E]">GS</div>
                  <div>
                    <p className="font-title text-sm uppercase tracking-[0.25em] text-[#3A3A3A]/55">{album.couple}</p>
                    <p className="hidden text-xs text-[#3A3A3A]/45 sm:block">{album.date}</p>
                  </div>
                </div>
                <Button onClick={() => setShowGallery((value) => !value)} variant="ghost" className="px-3 py-2 text-[11px]">
                  {showGallery ? "Ocultar galeria" : "Galeria"}
                </Button>
              </div>
            </header>

            <div className="pt-32 sm:pt-16">
              <BookMode />
              <StoryMode />
              {showGallery && <GalleryMode />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
