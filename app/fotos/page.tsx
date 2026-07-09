"use client";

import { useState } from "react";

export default function FotosPage() {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  async function sendMedia() {
    setError("");
    if (!name.trim() || !file) {
      setError("Informe seu nome e selecione uma foto ou vídeo.");
      return;
    }

    const formData = new FormData();
    formData.append("contributor_name", name);
    formData.append("contributor_relation", relation);
    formData.append("caption", caption);
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch("/api/contributions/media", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível enviar o arquivo.");
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
        <h1 className="font-script mt-3 text-6xl leading-none">Envie suas fotos</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#3A3A3A]/65">Compartilhe fotos ou vídeos do casamento. O conteúdo ficará aguardando aprovação no painel antes de aparecer no álbum.</p>

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
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#3A3A3A]/45">Legenda opcional</span>
              <textarea value={caption} onChange={(event) => setCaption(event.target.value)} className="min-h-28 w-full rounded-2xl border border-[#C9A96E]/20 bg-[#FAF8F3] p-4 outline-none focus:border-[#C9A96E]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#3A3A3A]/45">Foto ou vídeo</span>
              <input type="file" accept="image/*,video/*" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full rounded-2xl border border-dashed border-[#C9A96E]/35 bg-[#FAF8F3] p-4" />
            </label>
            {file && <p className="text-sm text-[#3A3A3A]/60">Selecionado: {file.name}</p>}
            {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button disabled={loading} onClick={sendMedia} className="w-full rounded-full bg-[#A8CFC0] px-6 py-4 text-xs uppercase tracking-[0.24em] disabled:opacity-50">{loading ? "Enviando..." : "Enviar foto ou vídeo"}</button>
          </div>
        ) : (
          <div className="mt-9 rounded-[1.4rem] bg-[#C8DDD3]/35 p-7">
            <h2 className="font-title text-3xl">Arquivo recebido</h2>
            <p className="mt-3 text-sm leading-7 text-[#3A3A3A]/65">Obrigado, {name}. Sua foto ou vídeo foi salvo e ficará aguardando aprovação.</p>
            <button onClick={() => { setOk(false); setName(""); setRelation(""); setCaption(""); setFile(null); }} className="mt-6 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.22em]">Enviar outro</button>
          </div>
        )}
      </section>
    </main>
  );
}
