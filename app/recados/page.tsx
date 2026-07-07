"use client";

import { useState } from "react";

export default function RecadosPage() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [ok, setOk] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F3] px-6 py-12 text-[#3A3A3A]">
      <section className="w-full max-w-2xl rounded-[2rem] border border-[#C9A96E]/20 bg-white/75 p-7 text-center shadow-[0_30px_90px_rgba(58,58,58,0.10)] sm:p-10">
        <a href="/" className="mb-8 inline-flex text-xs uppercase tracking-[0.3em] text-[#3A3A3A]/50">Voltar ao álbum</a>
        <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-full border border-[#C9A96E]/45 bg-[#A8CFC0]/35 font-title text-2xl tracking-[0.18em] text-[#C9A96E]">GS</div>
        <p className="text-xs uppercase tracking-[0.36em] text-[#C9A96E]">Giovanna & Samuel</p>
        <h1 className="font-script mt-3 text-6xl leading-none">Deixe seu recado</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#3A3A3A]/65">Escreva uma lembrança ou carinho para o casal. Na versão final, o recado será enviado para aprovação no painel.</p>

        {!ok ? (
          <div className="mt-8 space-y-4 text-left">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#3A3A3A]/45">Seu nome</span>
              <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-[#C9A96E]/20 bg-[#FAF8F3] p-4 outline-none focus:border-[#C9A96E]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#3A3A3A]/45">Recado</span>
              <textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-36 w-full rounded-2xl border border-[#C9A96E]/20 bg-[#FAF8F3] p-4 outline-none focus:border-[#C9A96E]" />
            </label>
            <button onClick={() => name.trim() && text.trim() && setOk(true)} className="w-full rounded-full bg-[#A8CFC0] px-6 py-4 text-xs uppercase tracking-[0.24em]">Enviar recado</button>
          </div>
        ) : (
          <div className="mt-9 rounded-[1.4rem] bg-[#C8DDD3]/35 p-7">
            <h2 className="font-title text-3xl">Recado recebido</h2>
            <p className="mt-3 text-sm leading-7 text-[#3A3A3A]/65">Obrigado. Quando conectarmos o banco de dados, o recado ficará salvo para aprovação.</p>
            <button onClick={() => { setOk(false); setName(""); setText(""); }} className="mt-6 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.22em]">Escrever outro</button>
          </div>
        )}
      </section>
    </main>
  );
}
