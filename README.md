# Álbum Digital — Giovanna & Samuel

Implementação inicial em Next.js, TypeScript e CSS para um álbum digital de casamento com visual de álbum físico.

## Funcional agora

- Interface responsiva com capa verde-menta, lombada, textura de papel, sombras e animações de abertura/virada de página.
- Páginas narrativas: como se conheceram, primeiro encontro, primeiro beijo, despedida e o grande sim.
- Formulários para foto individual, múltiplas fotos e captura direta por celular, sempre com consentimento.
- Mural de recados e galeria com paginação.
- Rotas de API para recados, galeria e preparação de upload, usando D1 para recados/metadados e R2 para URLs públicas de fotos.
- Imagem de apresentação para compartilhamento no WhatsApp em `public/whatsapp-preview.svg`.

## Apenas demonstração até configurar credenciais

- Upload binário direto para R2: a rota atual persiste metadados no D1 e retorna a chave/URL esperada; a assinatura R2/S3 deve ser ativada no ambiente Sites com credenciais reais.
- Publicação privada de teste: depende do plugin Sites/ambiente de deploy e de dependências npm disponíveis.

## Persistência

Recados são gravados na tabela D1 `guest_messages`. Metadados de fotos são gravados na tabela D1 `photos`, enquanto os arquivos devem ser enviados para o bucket R2 `casamento-giovanna-samuel-fotos`. Nada enviado por convidados deve ser versionado no GitHub.

## Sites, R2 e D1

1. Crie o banco D1 e aplique `db/schema.sql`.
2. Crie o bucket R2 definido em `wrangler.toml`.
3. Preencha `.env.example` com credenciais reais no ambiente privado do Sites.
4. Substitua `REPLACE_WITH_D1_DATABASE_ID` em `wrangler.toml` pelo ID real do D1.
5. Configure a URL pública/CDN do R2 em `NEXT_PUBLIC_R2_PUBLIC_URL`.

## Galeria para aproximadamente 2 mil fotos

A rota `/api/gallery?page=1&pageSize=24` limita o tamanho de página, calcula `offset` e retorna `totalPages`. Com `pageSize=24`, 2 mil fotos são distribuídas em aproximadamente 84 páginas, evitando carregar tudo de uma vez.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
```

## Validação deste ambiente

- `npm run typecheck` executa com sucesso.
- `npm run build` não executa porque o binário `next` não está instalado.
- `npm install` está bloqueado por `403 Forbidden` no registry npm para pacotes de dependência, então não foi possível gerar build privada nem link de teste neste ambiente.
