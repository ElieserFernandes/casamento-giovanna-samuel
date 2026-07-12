"use client";

import { motion } from "framer-motion";
import { album } from "@/data/album";

export function StoryMode() {
  return (
    <section className="min-h-screen px-5 py-8 lg:hidden">
      <div className="mx-auto max-w-md">
        <div className="sticky top-0 z-20 -mx-5 mb-6 border-b border-[#C9A96E]/15 bg-[#FAF8F3]/88 px-5 py-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-[#3A3A3A]/45">Story Mode</p>
          <h2 className="font-script text-5xl leading-none text-[#3A3A3A]">Giovanna & Samuel</h2>
        </div>

        <div className="space-y-6">
          {album.memories.map((memory, position) => (
            <motion.article
              key={memory.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: position * 0.05 }}
              className="overflow-hidden rounded-[1.65rem] border border-[#C9A96E]/18 bg-white/72 shadow-[0_24px_70px_rgba(58,58,58,0.10)] backdrop-blur"
            >
              <div className="photo-placeholder grid aspect-[4/5] place-items-center">
                <div className="text-center">
                  <p className="font-title text-4xl text-[#3A3A3A]/72">{memory.imageLabel}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.33em] text-[#3A3A3A]/45">Imagem real</p>
                </div>
              </div>
              <div className="p-7">
                <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-[#C9A96E]">{memory.chapter}</p>
                <h3 className="font-script text-5xl leading-none text-[#3A3A3A]">{memory.title}</h3>
                <p className="mt-5 font-title text-2xl leading-tight text-[#3A3A3A]/82">“{memory.quote}”</p>
                <p className="mt-5 text-sm leading-7 text-[#3A3A3A]/70">{memory.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
