export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12 text-center">
      <section className="relative z-10 mx-auto max-w-3xl">
        <div className="mx-auto mb-8 grid h-28 w-28 place-items-center rounded-full border border-[#C9A96E]/45 bg-white/45 text-4xl tracking-[0.18em] text-[#C9A96E] shadow-[0_20px_70px_rgba(201,169,110,0.18)] backdrop-blur">
          <span className="font-title">GS</span>
        </div>
        <p className="mb-3 text-xs uppercase tracking-[0.5em] text-[#3A3A3A]/55">Eterno — Digital Memory Experience</p>
        <h1 className="font-script text-7xl leading-none text-[#3A3A3A] sm:text-8xl">Giovanna</h1>
        <div className="my-1 text-2xl text-[#C9A96E]">&</div>
        <h2 className="font-script text-7xl leading-none text-[#3A3A3A] sm:text-8xl">Samuel</h2>
        <p className="mt-7 font-title text-lg uppercase tracking-[0.42em] text-[#3A3A3A]/70">05 Julho 2026</p>
        <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-[#3A3A3A]/72 sm:text-lg">Reviva um dos dias mais importantes da sua vida.</p>
      </section>
    </main>
  );
}
