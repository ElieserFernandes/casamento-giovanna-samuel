"use client";

import { useState } from "react";

type Contribution = {
  id: string;
  contributor_name: string;
  contributor_relation: string | null;
  content_type: "photo" | "video" | "message";
  file_url: string | null;
  file_name: string | null;
  caption: string | null;
  message_text: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [items, setItems] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function loadContributions() {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/contributions", { headers: { "x-admin-token": token } });
      const result = await response.json() as any;
      if (!response.ok) throw new Error(result.error || "Erro ao carregar contribuições.");
      setItems(result.contributions || []);
      setStatus("Contribuições carregadas.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function moderate(id: string, nextStatus: "approved" | "rejected") {
    setStatus("");
    try {
      const response = await fetch(`/api/admin/contributions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ status: nextStatus })
      });
      const result = await response.json() as any;
      if (!response.ok) throw new Error(result.error || "Erro ao moderar.");
      setItems((current) => current.map((item) => item.id === id ? result.contribution : item));
      setStatus(nextStatus === "approved" ? "Contribuição aprovada." : "Contribuição rejeitada.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro inesperado.");
    }
  }

  async function uploadMedia() {
    setStatus("");
    if (!file || !name.trim()) {
      setStatus("Selecione um arquivo e informe o nome.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("contributor_name", name);
    formData.append("contributor_relation", relation);
    formData.append("caption", caption);

    setLoading(true);
    try {
      const response = await fetch("/api/contributions/media", { method: "POST", body: formData });
      const result = await response.json() as any;
      if (!response.ok) throw new Error(result.error || "Erro ao enviar arquivo.");
      setStatus("Arquivo enviado e aguardando aprovação.");
      setName("");
      setRelation("");
      setCaption("");
      setFile(null);
      await loadContributions();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  const pending = items.filter((item) => item.status === "pending").length;
  const approved = items.filter((item) => item.status === "approved").length;
  const media = items.filter((item) => item.content_type !== "message").length;

  return (
    <main className="min-h-screen bg-[#FAF8F3] p-5 text-[#3A3A3A] sm:p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-4 rounded-[2rem] border border-[#C9A96E]/20 bg-white/75 p-6 shadow-[0_20px_70px_rgba(58,58,58,0.08)] lg:flex-row lg:items-center">
          <div>
            <a href="/" className="text-xs uppercase tracking-[0.28em] text-[#3A3A3A]/45">Voltar ao álbum</a>
            <p className="mt-5 text-xs uppercase tracking-[0.36em] text-[#C9A96E]">Eterno Studio</p>
            <h1 className="font-title mt-2 text-4xl">Painel Administrativo</h1>
            <p className="mt-2 text-sm text-[#3A3A3A]/60">Fotos, vídeos e mensagens salvas no Supabase.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="ADMIN_TOKEN" className="rounded-full border border-[#C9A96E]/20 bg-[#FAF8F3] px-5 py-3 outline-none focus:border-[#C9A96E]" />
            <button onClick={loadContributions} disabled={loading || !token} className="rounded-full bg-[#A8CFC0] px-6 py-3 text-xs uppercase tracking-[0.22em] disabled:opacity-50">Carregar</button>
          </div>
        </div>

        {status && <p className="mb-6 rounded-2xl bg-white/80 p-4 text-sm text-[#3A3A3A]/70">{status}</p>}

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card title="Pendentes" value={pending} />
          <Card title="Aprovadas" value={approved} />
          <Card title="Fotos e vídeos" value={media} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-[2rem] border border-[#C9A96E]/20 bg-white/75 p-6">
            <h2 className="font-title text-3xl">Enviar foto ou vídeo</h2>
            <p className="mt-2 text-sm leading-6 text-[#3A3A3A]/60">Este envio salva no bucket wedding-media e entra como pendente.</p>
            <div className="mt-6 space-y-4">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome de quem enviou" className="w-full rounded-2xl border border-[#C9A96E]/20 bg-[#FAF8F3] p-4 outline-none" />
              <input value={relation} onChange={(event) => setRelation(event.target.value)} placeholder="Relação com o casal" className="w-full rounded-2xl border border-[#C9A96E]/20 bg-[#FAF8F3] p-4 outline-none" />
              <textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Legenda opcional" className="min-h-24 w-full rounded-2xl border border-[#C9A96E]/20 bg-[#FAF8F3] p-4 outline-none" />
              <input type="file" accept="image/*,video/*" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full rounded-2xl border border-dashed border-[#C9A96E]/35 bg-[#FAF8F3] p-4" />
              <button onClick={uploadMedia} disabled={loading} className="w-full rounded-full bg-[#A8CFC0] px-6 py-4 text-xs uppercase tracking-[0.22em] disabled:opacity-50">Enviar mídia</button>
            </div>
          </div>

          <div className="space-y-4">
            {items.length === 0 && <div className="rounded-[2rem] border border-dashed border-[#C9A96E]/30 bg-white/60 p-10 text-center text-sm text-[#3A3A3A]/55">Informe o ADMIN_TOKEN e clique em carregar.</div>}
            {items.map((item) => (
              <article key={item.id} className="grid gap-4 rounded-[2rem] border border-[#C9A96E]/18 bg-white/80 p-5 shadow-[0_18px_60px_rgba(58,58,58,0.07)] md:grid-cols-[220px_1fr]">
                <div className="overflow-hidden rounded-[1.3rem] bg-[#C8DDD3]/35">
                  {item.content_type === "photo" && item.file_url ? <img src={item.file_url} alt={item.caption || item.contributor_name} className="h-52 w-full object-cover" /> : null}
                  {item.content_type === "video" && item.file_url ? <video src={item.file_url} controls className="h-52 w-full object-cover" /> : null}
                  {item.content_type === "message" ? <div className="grid h-52 place-items-center p-6 text-center font-title text-2xl">Mensagem</div> : null}
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-title text-2xl">{item.contributor_name}</h3>
                      <p className="text-xs text-[#3A3A3A]/50">{item.contributor_relation || "Sem relação informada"}</p>
                    </div>
                    <span className="rounded-full bg-[#FAF8F3] px-3 py-1 text-[11px] uppercase tracking-[0.18em]">{item.status}</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#3A3A3A]/70">{item.message_text || item.caption || "Sem legenda."}</p>
                  <p className="mt-3 text-xs text-[#3A3A3A]/45">{new Date(item.created_at).toLocaleString("pt-BR")}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button onClick={() => moderate(item.id, "approved")} className="rounded-full bg-[#A8CFC0]/70 px-5 py-2 text-xs uppercase tracking-[0.18em]">Aprovar</button>
                    <button onClick={() => moderate(item.id, "rejected")} className="rounded-full bg-white px-5 py-2 text-xs uppercase tracking-[0.18em] text-[#3A3A3A]/60">Rejeitar</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return <div className="rounded-[2rem] border border-[#C9A96E]/18 bg-white/75 p-6"><p className="text-xs uppercase tracking-[0.28em] text-[#3A3A3A]/45">{title}</p><strong className="font-title mt-3 block text-5xl">{value}</strong></div>;
}
