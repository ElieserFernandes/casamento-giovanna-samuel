"use client";

import { useMemo, useState } from "react";
import { album } from "@/data/album";

type UploadItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  memory: string;
};

type MessageItem = {
  id: string;
  author: string;
  text: string;
  status: "Pendente" | "Aprovada";
};

function formatSize(size: number) {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminPage() {
  const [active, setActive] = useState("dashboard");
  const [couple, setCouple] = useState(album.couple);
  const [date, setDate] = useState(album.date);
  const [headline, setHeadline] = useState(album.headline);
  const [selectedMemory, setSelectedMemory] = useState(album.memories[1]?.title ?? "O Grande Sim");
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([
    { id: "1", author: "Família", text: "Que este dia continue vivo para sempre no coração de vocês.", status: "Aprovada" },
    { id: "2", author: "Convidado", text: "Foi emocionante participar deste momento tão especial.", status: "Pendente" }
  ]);
  const [author, setAuthor] = useState("");
  const [messageText, setMessageText] = useState("");

  const stats = useMemo(() => {
    const photos = uploads.filter((item) => item.type.startsWith("image/")).length;
    const videos = uploads.filter((item) => item.type.startsWith("video/")).length;
    const approved = messages.filter((item) => item.status === "Aprovada").length;
    return { photos, videos, approved };
  }, [uploads, messages]);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      memory: selectedMemory
    }));
    setUploads((current) => [...next, ...current]);
  }

  function addMessage() {
    if (!author.trim() || !messageText.trim()) return;
    setMessages((current) => [
      { id: `${Date.now()}`, author: author.trim(), text: messageText.trim(), status: "Pendente" },
      ...current
    ]);
    setAuthor("");
    setMessageText("");
  }

  function approveMessage(id: string) {
    setMessages((current) => current.map((item) => item.id === id ? { ...item, status: "Aprovada" } : item));
  }

  function removeMessage(id: string) {
    setMessages((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#FAF8F3] text-[#3A3A3A]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-[#C9A96E]/20 bg-white/70 p-6 backdrop-blur lg:border-b-0 lg:border-r">
          <a href="/" className="mb-8 inline-flex text-xs uppercase tracking-[0.32em] text-[#3A3A3A]/55">← Ver álbum</a>
          <div className="mb-10">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-full border border-[#C9A96E]/45 bg-[#A8CFC0]/45 font-title text-xl tracking-[0.18em] text-[#C9A96E]">GS</div>
            <p className="text-xs uppercase tracking-[0.36em] text-[#3A3A3A]/45">Eterno Studio</p>
            <h1 className="font-title mt-2 text-3xl">Admin</h1>
          </div>

          <nav className="space-y-2">
            {[
              ["dashboard", "Dashboard"],
              ["album", "Editar álbum"],
              ["uploads", "Fotos e vídeos"],
              ["messages", "Mensagens"],
              ["settings", "Configurações"]
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${active === id ? "bg-[#A8CFC0]/60 text-[#3A3A3A]" : "hover:bg-[#C8DDD3]/45 text-[#3A3A3A]/65"}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="p-5 sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col justify-between gap-4 rounded-[2rem] border border-[#C9A96E]/18 bg-white/65 p-6 shadow-[0_20px_70px_rgba(58,58,58,0.08)] sm:flex-row sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#C9A96E]">Projeto publicado</p>
              <h2 className="font-script mt-2 text-5xl leading-none">{couple}</h2>
              <p className="mt-2 text-sm text-[#3A3A3A]/60">{date}</p>
            </div>
            <div className="rounded-full bg-[#C8DDD3]/50 px-5 py-2 text-xs uppercase tracking-[0.22em]">Protótipo funcional</div>
          </div>

          {active === "dashboard" && (
            <div className="grid gap-5 md:grid-cols-3">
              <Card title="Fotos" value={String(stats.photos)} note="Pré-visualização local" />
              <Card title="Vídeos" value={String(stats.videos)} note="Pré-visualização local" />
              <Card title="Mensagens aprovadas" value={String(stats.approved)} note="Prontas para exibir" />
              <div className="rounded-[2rem] border border-[#C9A96E]/18 bg-white/70 p-7 md:col-span-3">
                <h3 className="font-title text-3xl">Próximos passos do álbum</h3>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <Step number="1" text="Subir fotos do cartório em O Grande Sim." />
                  <Step number="2" text="Aprovar mensagens dos familiares." />
                  <Step number="3" text="Conectar Supabase Storage para salvar tudo online." />
                </div>
              </div>
            </div>
          )}

          {active === "album" && (
            <Panel title="Editar dados do álbum" subtitle="Altere as informações principais da experiência.">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Nome do casal" value={couple} onChange={setCouple} />
                <Field label="Data" value={date} onChange={setDate} />
                <label className="md:col-span-2">
                  <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#3A3A3A]/45">Frase principal</span>
                  <textarea value={headline} onChange={(event) => setHeadline(event.target.value)} className="min-h-28 w-full rounded-2xl border border-[#C9A96E]/20 bg-white/80 p-4 outline-none focus:border-[#C9A96E]" />
                </label>
              </div>
              <div className="mt-7 rounded-2xl bg-[#C8DDD3]/35 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#3A3A3A]/45">Prévia</p>
                <h3 className="font-script mt-3 text-5xl">{couple}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#3A3A3A]/70">{headline}</p>
              </div>
            </Panel>
          )}

          {active === "uploads" && (
            <Panel title="Fotos e vídeos" subtitle="Suba arquivos e vincule cada envio a uma lembrança do álbum.">
              <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
                <div className="rounded-[1.6rem] border border-dashed border-[#C9A96E]/45 bg-[#FAF8F3] p-6">
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#3A3A3A]/45">Lembrança</span>
                    <select value={selectedMemory} onChange={(event) => setSelectedMemory(event.target.value)} className="mb-5 w-full rounded-2xl border border-[#C9A96E]/20 bg-white p-3 outline-none">
                      {album.memories.map((memory) => <option key={memory.id}>{memory.title}</option>)}
                    </select>
                  </label>
                  <label className="grid min-h-44 cursor-pointer place-items-center rounded-2xl bg-white/80 p-6 text-center transition hover:bg-white">
                    <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(event) => handleFiles(event.target.files)} />
                    <span>
                      <strong className="block font-title text-2xl">Selecionar arquivos</strong>
                      <small className="mt-2 block text-[#3A3A3A]/55">Fotos e vídeos do casamento</small>
                    </span>
                  </label>
                  <p className="mt-4 text-xs leading-6 text-[#3A3A3A]/55">Nesta fase os arquivos aparecem na tela para conferência. Na integração com Supabase eles serão salvos online.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {uploads.length === 0 && <Empty text="Nenhum arquivo enviado ainda." />}
                  {uploads.map((item) => (
                    <article key={item.id} className="overflow-hidden rounded-[1.4rem] border border-[#C9A96E]/18 bg-white/80">
                      {item.type.startsWith("image/") ? <img src={item.url} alt={item.name} className="h-44 w-full object-cover" /> : <video src={item.url} className="h-44 w-full object-cover" controls />}
                      <div className="p-4">
                        <p className="truncate font-title text-xl">{item.name}</p>
                        <p className="mt-1 text-xs text-[#3A3A3A]/55">{item.memory} · {formatSize(item.size)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Panel>
          )}

          {active === "messages" && (
            <Panel title="Mensagens" subtitle="Receba, aprove e organize mensagens para exibir no encerramento do álbum.">
              <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <div className="rounded-[1.6rem] bg-[#C8DDD3]/30 p-5">
                  <Field label="Nome" value={author} onChange={setAuthor} />
                  <label className="mt-4 block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#3A3A3A]/45">Mensagem</span>
                    <textarea value={messageText} onChange={(event) => setMessageText(event.target.value)} className="min-h-32 w-full rounded-2xl border border-[#C9A96E]/20 bg-white/80 p-4 outline-none focus:border-[#C9A96E]" />
                  </label>
                  <button onClick={addMessage} className="mt-4 w-full rounded-full bg-[#A8CFC0] px-5 py-3 text-xs uppercase tracking-[0.24em]">Adicionar mensagem</button>
                </div>
                <div className="space-y-4">
                  {messages.map((item) => (
                    <article key={item.id} className="rounded-[1.4rem] border border-[#C9A96E]/18 bg-white/80 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h4 className="font-title text-2xl">{item.author}</h4>
                        <span className="rounded-full bg-[#FAF8F3] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#3A3A3A]/55">{item.status}</span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[#3A3A3A]/70">{item.text}</p>
                      <div className="mt-4 flex gap-3">
                        <button onClick={() => approveMessage(item.id)} className="rounded-full bg-[#A8CFC0]/65 px-4 py-2 text-xs uppercase tracking-[0.18em]">Aprovar</button>
                        <button onClick={() => removeMessage(item.id)} className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#3A3A3A]/55">Remover</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Panel>
          )}

          {active === "settings" && (
            <Panel title="Configurações" subtitle="Preparação para publicação final e integração com banco de dados.">
              <div className="grid gap-5 md:grid-cols-2">
                <Setting title="Status" text="Protótipo publicado na Vercel." />
                <Setting title="Armazenamento" text="Próximo passo: Supabase Storage para fotos e vídeos." />
                <Setting title="Banco" text="Próximo passo: Supabase PostgreSQL para álbuns e mensagens." />
                <Setting title="Acesso" text="Painel administrativo sem login nesta fase. Login será adicionado depois." />
              </div>
            </Panel>
          )}
        </section>
      </div>
    </main>
  );
}

function Card({ title, value, note }: { title: string; value: string; note: string }) {
  return <div className="rounded-[2rem] border border-[#C9A96E]/18 bg-white/70 p-7"><p className="text-xs uppercase tracking-[0.28em] text-[#3A3A3A]/45">{title}</p><strong className="font-title mt-4 block text-5xl text-[#3A3A3A]">{value}</strong><p className="mt-3 text-sm text-[#3A3A3A]/55">{note}</p></div>;
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <div className="rounded-[2rem] border border-[#C9A96E]/18 bg-white/70 p-6 shadow-[0_20px_70px_rgba(58,58,58,0.08)]"><div className="mb-7"><h3 className="font-title text-4xl">{title}</h3><p className="mt-2 text-sm text-[#3A3A3A]/60">{subtitle}</p></div>{children}</div>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#3A3A3A]/45">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-[#C9A96E]/20 bg-white/80 p-4 outline-none focus:border-[#C9A96E]" /></label>;
}

function Step({ number, text }: { number: string; text: string }) {
  return <div className="rounded-2xl bg-white/70 p-5"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#A8CFC0]/65 font-title">{number}</span><p className="mt-4 text-sm leading-6 text-[#3A3A3A]/70">{text}</p></div>;
}

function Setting({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl bg-[#FAF8F3] p-5"><h4 className="font-title text-2xl">{title}</h4><p className="mt-2 text-sm leading-6 text-[#3A3A3A]/65">{text}</p></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-[1.4rem] border border-dashed border-[#C9A96E]/35 bg-white/50 p-8 text-center text-sm text-[#3A3A3A]/55 sm:col-span-2 xl:col-span-3">{text}</div>;
}
