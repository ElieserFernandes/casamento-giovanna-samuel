"use client";

import { useEffect, useState } from "react";

type GalleryItem = {
  id: string;
  contributor_name: string;
  contributor_relation: string | null;
  content_type: "photo" | "video";
  file_url: string | null;
  caption: string | null;
  created_at: string;
};

export function GalleryMode() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/gallery?page=${page}&pageSize=9`);
        const result = await response.json() as any;
        if (!response.ok) throw new Error(result.error || "Erro ao carregar galeria.");
        setItems((current) => page === 1 ? result.items || [] : [...current, ...(result.items || [])]);
        setHasMore(Boolean(result.hasMore));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado.");
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, [page]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.42em] text-[#3A3A3A]/45">Galeria</p>
      <h2 className="font-title text-4xl text-[#3A3A3A]">Lembranças enviadas</h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#3A3A3A]/60">Fotos e vídeos aprovados no painel aparecem aqui como parte do álbum digital.</p>

      {loading && items.length === 0 && <p className="mt-10 rounded-[1.5rem] bg-white/65 p-6 text-sm text-[#3A3A3A]/55">Carregando imagens...</p>}
      {error && <p className="mt-10 rounded-[1.5rem] bg-red-50 p-6 text-sm text-red-700">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <div className="mt-10 rounded-[1.8rem] border border-dashed border-[#C9A96E]/30 bg-white/60 p-10">
          <p className="font-title text-2xl text-[#3A3A3A]">Nenhuma foto aprovada ainda</p>
          <p className="mt-3 text-sm leading-7 text-[#3A3A3A]/60">Envie fotos em /fotos e aprove no painel para elas aparecerem aqui.</p>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[1.8rem] border border-[#C9A96E]/18 bg-white/75 text-left shadow-[0_24px_70px_rgba(58,58,58,0.08)]">
                <div className="aspect-[4/5] bg-[#C8DDD3]/30">
                  {item.content_type === "photo" && item.file_url ? (
                    <img src={item.file_url} alt={item.caption || item.contributor_name} className="h-full w-full object-cover" />
                  ) : null}
                  {item.content_type === "video" && item.file_url ? (
                    <video src={item.file_url} controls className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-5">
                  <p className="font-title text-xl text-[#3A3A3A]">{item.contributor_name}</p>
                  {item.contributor_relation && <p className="mt-1 text-xs text-[#3A3A3A]/45">{item.contributor_relation}</p>}
                  {item.caption && <p className="mt-3 text-sm leading-6 text-[#3A3A3A]/65">{item.caption}</p>}
                </div>
              </article>
            ))}
          </div>
          {hasMore && (
            <button onClick={() => setPage((value) => value + 1)} disabled={loading} className="mt-10 rounded-full bg-[#A8CFC0] px-7 py-4 text-xs uppercase tracking-[0.22em] text-[#3A3A3A] disabled:opacity-50">
              {loading ? "Carregando..." : "Carregar mais lembranças"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
