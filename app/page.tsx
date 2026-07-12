const chapters = [
  { title: 'Como se conheceram', text: 'Entre amigos, risadas e uma conversa que parecia antiga, Giovanna e Samuel descobriram que o acaso também escreve convites.' },
  { title: 'Primeiro encontro', text: 'Um café virou passeio, o passeio virou planos e a tarde ficou guardada como primeira página favorita.' },
  { title: 'Primeiro beijo', text: 'Com o coração acelerado e o mundo em silêncio, veio o beijo que confirmou o começo de tudo.' },
  { title: 'Despedida', text: 'A despedida da vida de solteiros celebrou amizades, memórias e a alegria de chegar até aqui.' },
  { title: 'O grande sim', text: 'Diante de quem amam, Giovanna e Samuel disseram sim para a vida inteira, abrindo este álbum para novas lembranças.' },
];

const gallery = Array.from({ length: 12 }, (_, index) => ({
  label: `Memória ${index + 1}`,
  hue: 130 + index * 9,
}));

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="titulo">
        <div className="album" aria-label="Álbum físico digital aberto">
          <div className="cover">
            <span className="spine" />
            <div className="cover-content">
              <p>Álbum de casamento</p>
              <h1 id="titulo">Giovanna & Samuel</h1>
              <span>12 • 07 • 2026</span>
            </div>
          </div>
          <div className="paper page-left">
            <h2>Nossa história</h2>
            <p>Um álbum verde-menta com textura de papel, sombra suave e páginas que parecem virar a cada lembrança.</p>
          </div>
          <div className="paper page-right">
            <h2>Compartilhe</h2>
            <p>Envie fotos, deixe recados e ajude a construir uma galeria preparada para milhares de registros.</p>
          </div>
        </div>
      </section>

      <section className="chapters" aria-label="História dos noivos">
        {chapters.map((chapter, index) => (
          <article className="story-page" key={chapter.title} style={{ ['--delay' as string]: `${index * 90}ms` }}>
            <span>Capítulo {index + 1}</span>
            <h2>{chapter.title}</h2>
            <p>{chapter.text}</p>
          </article>
        ))}
      </section>

      <section className="actions" aria-labelledby="envios">
        <div>
          <p className="eyebrow">Participação dos convidados</p>
          <h2 id="envios">Envie suas lembranças</h2>
          <p>Os formulários abaixo simulam a integração com armazenamento externo, ideal para manter imagens fora do GitHub e escalar a galeria.</p>
        </div>
        <form className="upload-card">
          <label>Foto individual<input type="file" accept="image/*" /></label>
          <label>Várias fotos<input type="file" accept="image/*" multiple /></label>
          <label>Foto pelo celular<input type="file" accept="image/*" capture="environment" /></label>
          <label className="consent"><input type="checkbox" required /> Autorizo o envio e uso das fotos no álbum dos noivos.</label>
          <button type="button">Preparar envio</button>
        </form>
      </section>

      <section className="gallery" aria-labelledby="galeria">
        <div className="section-title">
          <p className="eyebrow">Galeria otimizada</p>
          <h2 id="galeria">Pronta para aproximadamente 2 mil imagens</h2>
          <p>Grade paginada conceitual com carregamento preguiçoso, miniaturas leves e espaço para backend persistente.</p>
        </div>
        <div className="photo-grid">
          {gallery.map((item) => (
            <figure key={item.label} className="photo" style={{ ['--hue' as string]: item.hue }}>
              <div role="img" aria-label={item.label} />
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </div>
        <nav className="pagination" aria-label="Paginação da galeria"><button>Anterior</button><span>Página 1 de 100</span><button>Próxima</button></nav>
      </section>

      <section className="guestbook" aria-labelledby="recados">
        <div>
          <p className="eyebrow">Mural de carinho</p>
          <h2 id="recados">Deixe seu recado</h2>
        </div>
        <form>
          <input placeholder="Seu nome" aria-label="Seu nome" />
          <textarea placeholder="Escreva uma mensagem para Giovanna e Samuel" aria-label="Mensagem" />
          <label className="consent"><input type="checkbox" required /> Concordo em publicar meu recado no mural.</label>
          <button type="button">Enviar recado</button>
        </form>
        <div className="notes">
          <blockquote>Que esse sim seja o começo de uma vida leve, feliz e cheia de cumplicidade.</blockquote>
          <blockquote>Amamos celebrar vocês. Viva Giovanna e Samuel!</blockquote>
        </div>
      </section>
    </main>
  );
}
