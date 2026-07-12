'use client';

import { FormEvent, useEffect, useState } from 'react';

const chapters = [
  { title: 'Como se conheceram', text: 'Entre amigos, risadas e uma conversa que parecia antiga, Giovanna e Samuel descobriram que o acaso também escreve convites.' },
  { title: 'Primeiro encontro', text: 'Um café virou passeio, o passeio virou planos e a tarde ficou guardada como primeira página favorita.' },
  { title: 'Primeiro beijo', text: 'Com o coração acelerado e o mundo em silêncio, veio o beijo que confirmou o começo de tudo.' },
  { title: 'Despedida', text: 'A despedida da vida de solteiros celebrou amizades, memórias e a alegria de chegar até aqui.' },
  { title: 'O grande sim', text: 'Diante de quem amam, Giovanna e Samuel disseram sim para a vida inteira, abrindo este álbum para novas lembranças.' },
];

type Photo = { id: string; file_name: string; public_url: string; created_at: string };
type Message = { id: string; name: string; message: string; created_at: string };

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('Pronto para receber memórias.');

  useEffect(() => {
    void loadGallery(page);
    void loadMessages();
  }, [page]);

  async function loadGallery(nextPage = 1) {
    const response = await fetch(`/api/gallery?page=${nextPage}&pageSize=24`);
    if (response.ok) {
      const data = await response.json();
      setPhotos(data.photos);
      setTotalPages(Math.max(data.totalPages, 1));
    }
  }

  async function loadMessages() {
    const response = await fetch('/api/messages?page=1&pageSize=10');
    if (response.ok) {
      const data = await response.json();
      setMessages(data.messages);
    }
  }

  async function submitPhotos(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const consent = new FormData(form).get('photoConsent') === 'on';
    const inputs = Array.from(form.querySelectorAll<HTMLInputElement>('input[type="file"]'));
    const files = inputs.flatMap((input) => Array.from(input.files ?? []));

    if (!consent || files.length === 0) {
      setStatus('Selecione ao menos uma foto e aceite o consentimento.');
      return;
    }

    setStatus(`Enviando ${files.length} foto(s)...`);
    for (const file of files) {
      const body = new FormData();
      body.append('file', file);
      body.append('consent', 'true');
      const response = await fetch('/api/uploads/presign', { method: 'POST', body });
      if (!response.ok) {
        setStatus('Não foi possível enviar uma das fotos.');
        return;
      }
    }

    form.reset();
    setStatus('Fotos enviadas e persistidas no R2.');
    await loadGallery(page);
  }

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch('/api/messages', { method: 'POST', body: formData });

    if (!response.ok) {
      setStatus('Preencha nome, recado e consentimento antes de enviar.');
      return;
    }

    form.reset();
    setStatus('Recado enviado e persistido no D1.');
    await loadMessages();
  }

  return (
    <main>
      <section className="hero" aria-labelledby="titulo">
        <div className="album" aria-label="Álbum físico digital aberto">
          <div className="cover"><span className="spine" /><div className="cover-content"><p>Álbum de casamento</p><h1 id="titulo">Giovanna & Samuel</h1><span>12 • 07 • 2026</span></div></div>
          <div className="paper page-left"><h2>Nossa história</h2><p>Um álbum verde-menta com textura de papel, sombra suave e páginas que parecem virar a cada lembrança.</p></div>
          <div className="paper page-right"><h2>Compartilhe</h2><p>Envie fotos, deixe recados e ajude a construir uma galeria preparada para milhares de registros.</p></div>
        </div>
      </section>

      <section className="chapters" aria-label="História dos noivos">{chapters.map((chapter, index) => <article className="story-page" key={chapter.title} style={{ ['--delay' as string]: `${index * 90}ms` }}><span>Capítulo {index + 1}</span><h2>{chapter.title}</h2><p>{chapter.text}</p></article>)}</section>

      <section className="actions" aria-labelledby="envios"><div><p className="eyebrow">Participação dos convidados</p><h2 id="envios">Envie suas lembranças</h2><p>Os arquivos são enviados para o binding R2 <strong>ALBUM_PHOTOS</strong>, e os metadados ficam no D1 <strong>DB</strong>.</p><p className="status" role="status">{status}</p></div><form className="upload-card" onSubmit={submitPhotos}><label>Foto individual<input name="singlePhoto" type="file" accept="image/*" /></label><label>Várias fotos<input name="multiPhotos" type="file" accept="image/*" multiple /></label><label>Foto pelo celular<input name="cameraPhoto" type="file" accept="image/*" capture="environment" /></label><label className="consent"><input name="photoConsent" type="checkbox" required /> Autorizo o envio e uso das fotos no álbum dos noivos.</label><button type="submit">Enviar foto(s)</button></form></section>

      <section className="gallery" aria-labelledby="galeria"><div className="section-title"><p className="eyebrow">Galeria persistente</p><h2 id="galeria">Fotos do R2 com paginação real</h2><p>Com 24 fotos por página, aproximadamente 2 mil fotos são distribuídas em cerca de 84 páginas.</p></div><div className="photo-grid">{photos.length === 0 ? <p>Nenhuma foto enviada ainda.</p> : photos.map((item) => <figure key={item.id} className="photo"><img src={item.public_url} alt={item.file_name} loading="lazy" /><figcaption>{item.file_name}</figcaption></figure>)}</div><nav className="pagination" aria-label="Paginação da galeria"><button disabled={page <= 1} onClick={() => setPage((current) => Math.max(current - 1, 1))}>Anterior</button><span>Página {page} de {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Próxima</button></nav></section>

      <section className="guestbook" aria-labelledby="recados"><div><p className="eyebrow">Mural de carinho</p><h2 id="recados">Deixe seu recado</h2></div><form onSubmit={submitMessage}><input name="name" placeholder="Seu nome" aria-label="Seu nome" required /><textarea name="message" placeholder="Escreva uma mensagem para Giovanna e Samuel" aria-label="Mensagem" required /><label className="consent"><input name="consent" type="checkbox" required /> Concordo em publicar meu recado no mural.</label><button type="submit">Enviar recado</button></form><div className="notes">{messages.length === 0 ? <blockquote>Seja a primeira pessoa a deixar um recado.</blockquote> : messages.map((note) => <blockquote key={note.id}><strong>{note.name}</strong><br />{note.message}</blockquote>)}</div></section>
    </main>
  );
}
