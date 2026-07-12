export function BookMode() {
  return (
    <section className="hidden min-h-screen items-center justify-center px-8 py-12 lg:flex">
      <div className="book-shadow page-paper w-full max-w-5xl rounded-[1.8rem] p-14 text-center">
        <p className="text-xs uppercase tracking-[0.42em] text-[#3A3A3A]/45">Book Mode</p>
        <h2 className="font-script mt-6 text-7xl text-[#3A3A3A]">Giovanna & Samuel</h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-[#3A3A3A]/70">
          O motor de páginas será expandido na próxima etapa com virada realista e fotos reais.
        </p>
      </div>
    </section>
  );
}
