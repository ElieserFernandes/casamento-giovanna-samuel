"use client";

import { useState } from "react";

export default function RecadosPage() {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [text, setText] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage() {
    setError("");
    if (!name.trim() || !text.trim()) {
      setError("Informe seu nome e escreva o recado.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/contributions/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contributor_name: name,
          contributor_relation: relation,
          message_text: text
        })
      });

      const result = await response.json() as any;
      if (!response.ok) throw new Error(result.error || "Não foi possível enviar o recado.");
      setOk(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F3] px-6 py-12 text-[#3A3A3A]">
      <section className="w-full max-w-2xl rounded-[2rem] border border-[#C9A96E]/20 bg-white/75 p-7 text-center shadow-[0_30px_90px_rgba(58,58,58,0.10)] sm:p-10">
        <a href="/" className="mb-8 inline-flex text-xs uppercase tracking-[0.3em] text-[#3A3A3A]/50">Voltar ao álbum</a>
        <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-full border border-[#C9A96E]/45 bg-[#A8CFC0]/35 font-title text-2xl tracking-[0.18em] text-[#C9A96E]">GS</div>
        <p className="text-xs uppercase tracking-[0.36em] text-[#C9A96E]">Giovanna & Samuel</p>
        <h1 className="font-script mt-3 text-6xl leading-none">Deixe seu recado</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#3A3A3A]/65">Escreva uma lembrança ou carinho para o casal. O recado será salvo e ficará aguardando aprovação no painel.</p>

        {!ok ? (
          <div className="mt-8 space-y-4 text-left">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#3A3A3A]/45">Seu nome</span>
              <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-[#C9A96E]/20 bg-[#FAF8F3] p-4 outline-none focus:border-[#C9A96E]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#3A3A3A]/45">Parentesco ou relação</span>
              <input value={relation} onChange={(event) => setRelation(event.target.value)} placeholder="Ex.: amigo, tia, primo" className="w-full rounded-2xl border border-[#C9A96E]/20 bg-[#FAF8F3] p-4 outline-none focus:border-[#C9A96E]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#3A3A3A]/45">Recado</span>
              <textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-36 w-full rounded-2xl border border-[#C9A96E]/20 bg-[#FAF8F3] p-4 outline-none focus:border-[#C9A96E]" />
            </label>
            {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button disabled={loading} onClick={sendMessage} className="w-full rounded-full bg-[#A8CFC0] px-6 py-4 text-xs uppercase tracking-[0.24em] disabled:opacity-50">{loading ? "Enviando..." : "Enviar recado"}</button>
          </div>
        ) : (
          <div className="mt-9 rounded-[1.4rem] bg-[#C8DDD3]/35 p-7">
            <h2 className="font-title text-3xl">Recado recebido</h2>
            <p className="mt-3 text-sm leading-7 text-[#3A3A3A]/65">Obrigado, {name}. Seu recado foi salvo e ficará aguardando aprovação.</p>
            <button onClick={() => { setOk(false); setName(""); setRelation(""); setText(""); }} className="mt-6 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.22em]">Escrever outro</button>
          </div>
        )}
      </section>
    </main>
  );
}
