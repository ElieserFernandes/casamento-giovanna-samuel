# ETERNO — Giovanna & Samuel

Protótipo funcional do Álbum Digital Premium de Casamento.

## Conceito

Este projeto não é uma galeria de fotos, site de casamento ou PDF online. A proposta é uma experiência digital emocional, com sensação de álbum físico virtual e narrativa visual interativa.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui como base futura de componentes
- Supabase futuro
- Vercel futuro

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois acesse:

```bash
http://localhost:3000
```

## O que já está implementado

- Tela inicial emocional
- Capa do álbum com textura de linho
- Monograma GS
- Paleta oficial
- Tipografia premium
- Book Mode para desktop
- Story Mode para celular
- Gallery Mode opcional
- Estrutura por lembranças/cenas, não por páginas fixas

## Onde trocar os textos e capítulos

Edite o arquivo:

```bash
data/album.ts
```

## Onde inserir fotos reais

Próxima etapa: substituir os placeholders por imagens reais em `public/images` e mapear cada foto na estrutura das lembranças.

## Próximas etapas

1. Inserir fotos reais do cartório.
2. Criar componente de vídeo.
3. Melhorar virada de página com gesto/toque.
4. Criar Studio administrativo.
5. Integrar Supabase PostgreSQL e Supabase Storage.
6. Publicar na Vercel.
