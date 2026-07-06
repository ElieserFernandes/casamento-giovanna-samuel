"use client";

import { motion } from "framer-motion";
import { album } from "@/data/album";
import { Button } from "@/components/ui/button";

type InitialScreenProps = {
  onStart: () => void;
};

export function InitialScreen({ onStart }: InitialScreenProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#C8DDD3_0%,transparent_34%),linear-gradient(180deg,#FAF8F3_0%,#FFFFFF_52%,#FAF8F3_100%)]" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 1 }}
          className="mb-8 grid h-28 w-28 place-items-center rounded-full border border-[#C9A96E]/45 bg-white/45 text-4xl tracking-[0.18em] text-[#C9A96E] shadow-[0_20px_70px_rgba(201,169,110,0.18)] backdrop-blur"
        >
          <span className="font-title">{album.monogram}</span>
        </motion.div>

        <p className="mb-3 text-xs uppercase tracking-[0.5em] text-[#3A3A3A]/55">{album.productLine}</p>
        <h1 className="font-script text-7xl leading-none text-[#3A3A3A] sm:text-8xl">Giovanna</h1>
        <div className="my-1 text-2xl text-[#C9A96E]">&</div>
        <h2 className="font-script text-7xl leading-none text-[#3A3A3A] sm:text-8xl">Samuel</h2>
        <p className="mt-7 font-title text-lg uppercase tracking-[0.42em] text-[#3A3A3A]/70">{album.date}</p>
        <p className="mt-8 max-w-xl text-base leading-8 text-[#3A3A3A]/72 sm:text-lg">{album.headline}</p>

        <Button onClick={onStart} className="mt-10">Reviver este dia</Button>
      </motion.div>
    </section>
  );
}
