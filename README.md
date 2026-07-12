# Álbum Digital — Giovanna & Samuel

Implementação em Next.js, TypeScript, CSS e Cloudflare Pages/Sites Functions para um álbum digital de casamento com visual de álbum físico.

## Funcional agora

- Interface responsiva com capa verde-menta, lombada, textura de papel, sombras e animações de abertura/virada de página.
- Páginas narrativas: como se conheceram, primeiro encontro, primeiro beijo, despedida e o grande sim.
- Formulários reais no cliente: envio de recados para `/api/messages` e envio de uma ou várias fotos para `/api/uploads/presign`.
- Mural de recados carregado de D1 pelo endpoint `/api/messages`.
- Galeria carregada de D1 pelo endpoint `/api/gallery`, com imagens hospedadas no R2 e renderização lazy.
- Persistência de recados e metadados no binding D1 `DB`.
- Persistência dos arquivos de imagem no binding R2 `ALBUM_PHOTOS`.
- Imagem de apresentação para compartilhamento no WhatsApp em `public/whatsapp-preview.svg`.

## Sites, R2 e D1

- `.openai/hosting.json` declara os recursos persistentes `DB` e `ALBUM_PHOTOS` para hospedagem.
- `wrangler.toml` mantém os bindings `DB` e `ALBUM_PHOTOS` para Cloudflare Pages.
- As funções em `functions/api/*` usam `env.DB` e `env.ALBUM_PHOTOS`; nenhum `CLOUDFLARE_API_TOKEN` é exposto ao aplicativo.
- A variável pública `NEXT_PUBLIC_R2_PUBLIC_URL` deve apontar para o domínio público/CDN do bucket R2.

## Persistência

Recados são gravados na tabela D1 `guest_messages`. Fotos são gravadas no bucket R2 `ALBUM_PHOTOS`, e seus metadados são gravados na tabela D1 `photos`. Nada enviado por convidados deve ser versionado no GitHub.

## Galeria para aproximadamente 2 mil fotos

A rota `/api/gallery?page=1&pageSize=24` limita o tamanho de página, calcula `offset` e retorna `totalPages`. Com `pageSize=24`, 2 mil fotos são distribuídas em aproximadamente 84 páginas, evitando carregar tudo de uma vez.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
```

## Validação deste ambiente

- `npm run typecheck` executa com sucesso.
- `npm install` segue bloqueado por `403 Forbidden` no registry npm para pacotes como `@cloudflare/workers-types`.
- `npm run build` não executa porque o binário `next` não está instalado sem dependências.
- Por causa do bloqueio de instalação/build, não foi possível gerar uma versão privada de teste nem fornecer um link hospedado neste ambiente.
