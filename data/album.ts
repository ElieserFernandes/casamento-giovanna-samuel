export type AlbumMemory = {
  id: string;
  chapter: string;
  title: string;
  date?: string;
  quote: string;
  body: string;
  imageLabel: string;
  mood: "mint" | "sage" | "paper" | "gold";
};

export const album: { couple: string; monogram: string; date: string; productLine: string; headline: string; openingText: string; memories: AlbumMemory[] } = {
  couple: "Giovanna & Samuel",
  monogram: "GS",
  date: "05 Julho 2026",
  productLine: "Eterno — Digital Memory Experience",
  headline: "Reviva um dos dias mais importantes da sua vida.",
  openingText: "Um álbum digital premium criado para ser sentido como um objeto: páginas, textura, silêncio, emoção e memória.",
  memories: [
    { id: "nossa-historia", chapter: "Capítulo 01", title: "Nossa História", quote: "Antes do grande dia, existia uma caminhada inteira até aqui.", body: "Uma introdução emocional para apresentar o casal, o caminho percorrido e a promessa que os trouxe até este momento.", imageLabel: "Foto do casal", mood: "paper" },
    { id: "o-grande-sim", chapter: "Capítulo 02", title: "O Grande Sim", date: "05 Julho 2026", quote: "Na assinatura, no olhar e no abraço: o início de uma nova família.", body: "Aqui entram as fotos do cartório: assinatura, certidão, casal, família e selfie coletiva.", imageLabel: "Cartório", mood: "mint" },
    { id: "nossa-familia", chapter: "Capítulo 03", title: "Nossa Família", quote: "Quem esteve perto tornou este dia ainda mais eterno.", body: "Um espaço para valorizar família, testemunhas, abraços e registros que carregam presença e afeto.", imageLabel: "Família", mood: "sage" },
    { id: "pequenos-detalhes", chapter: "Capítulo 04", title: "Pequenos Detalhes", quote: "O luxo mora nos detalhes que quase passam despercebidos.", body: "Detalhes do convite, alianças, flores, mãos, decoração e símbolos do dia.", imageLabel: "Detalhes", mood: "gold" },
    { id: "celebracao", chapter: "Capítulo 05", title: "Celebração", quote: "Depois do sim, a alegria encontrou voz, gesto e movimento.", body: "Cenas de comemoração, sorrisos, encontros e pequenos vídeos podem compor este capítulo.", imageLabel: "Celebração", mood: "mint" },
    { id: "para-sempre", chapter: "Capítulo 06", title: "Para Sempre", quote: "Alguns dias terminam. Outros continuam vivendo dentro da gente.", body: "Encerramento com mensagem final, monograma, data e espaço futuro para depoimentos.", imageLabel: "Encerramento", mood: "paper" }
  ]
};
