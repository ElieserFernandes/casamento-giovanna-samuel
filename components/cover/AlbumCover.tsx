"use client";

import { motion } from "framer-motion";
import { album } from "@/data/album";
import { Button } from "@/components/ui/button";

type AlbumCoverProps = {
  onOpen: () => void;
};

export function AlbumCover({ onOpen }: AlbumCoverProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-14">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#FAF8F3,#FFFFFF_45%,#C8DDD3_120%)]" />
      <motion.div
        initial={{ opacity: 0, rotateX: 10, y: 40 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[430px]"
      >
        <div className="album-linen book-shadow relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-white/40 p-9">
          <div className="absolute left-0 top-0 h-full w-7 bg-black/5" />
          <div className="absolute inset-5 rounded-[1.45rem] border border-[#C9A96E]/40" />
          <div className="absolute inset-8 rounded-[1.1rem] border border-white/30" />
          <div className="relative flex h-full flex-col items-center justify-between text-center">
            <p className="font-title text-xs uppercase tracking-[0.42em] text-[#3A3A3A]/58">Álbum de casamento</p>
            <div className="grid place-items-center">
              <div className="grid h-32 w-32 place-items-center rounded-full border border-[#C9A96E]/70 bg-white/12 text-[#C9A96E] shadow-inner">
                <span className="font-title text-5xl tracking-[0.16em]">{album.monogram}</span>
              </div>
              <h2 className="font-script mt-10 text-6xl leading-none text-[#3A3A3A]">Giovanna</h2>
              <p className="my-1 text-xl text-[#C9A96E]">&</p>
              <h3 className="font-script text-6xl leading-none text-[#3A3A3A]">Samuel</h3>
            </div>
            <p className="font-title text-sm uppercase tracking-[0.35em] text-[#3A3A3A]/65">{album.date}</p>
          </div>
        </div>
        <div className="mx-auto mt-9 flex justify-center">
          <Button onClick={onOpen} variant="soft">Abrir álbum</Button>
        </div>
      </motion.div>
    </section>
  );
}
