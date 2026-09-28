# Site institucional

A página inicial mantém a abertura animada. O conteúdo corporativo tem entradas HTML próprias, sem biblioteca de rotas:

- `/empresa.html`: identidade, visão e princípios.
- `/atuacao.html`: hospitalidade, parcerias e relações comerciais.
- `/destino.html`: relação da marca com Balneário Camboriú.
- `/contato.html`: dados comerciais e preparação de uma mensagem.

As entradas estão declaradas em `vite.config.ts`; o build produz os arquivos para hospedagem estática, sem exigir fallback de rotas. Os títulos e descrições de cada página estão nos respectivos HTMLs.

Conteúdo e placeholders ficam em `CORPORATE`, em `src/design.ts`. Medidas novas ficam em `CORPORATE_LAYOUT`, publicadas como propriedades CSS em `src/main.tsx`. As composições editoriais são derivadas do grid existente e não têm nodes próprios no Figma.

## Dados demonstrativos

Razão social, CNPJ, endereço, telefone e e-mail são placeholders autorizados. O domínio `.example` não representa um canal comercial ativo. O conteúdo editorial deve ser revisado pela empresa antes da publicação.

O formulário valida os campos, prepara um resumo e permite copiá-lo. Não envia mensagens, não salva os dados e não simula uma confirmação de envio. A integração com um canal oficial permanece pendente. O assunto pode ser preenchido pelo link, por exemplo `/contato.html?assunto=Parcerias`.

## Revisão editorial das páginas internas

As páginas internas usam `InternalPages.tsx` e `internal.css`. Os textos e as medidas dessa revisão ficam em `INTERNAL` e `INTERNAL_LAYOUT`, em `src/design.ts`. `CORPORATE`, `corporate.css` e os componentes da página inicial foram preservados. O `App` seleciona a composição interna apenas nas quatro entradas institucionais.

A pesquisa passou pela ficha de [Bart & Taylor no Awwwards](https://www.awwwards.com/sites/bart-taylor) e pela navegação do [site publicado](https://bartandtaylor.co.uk/). As capturas locais estão em `.visual-check/ref-research-bart-*.png`. A referência contribuiu com a organização por tipografia, linhas e fotografias em diferentes posições. Não foram copiados textos, imagens, marcas ou animações do site.

Aplicações na Urban Stay:

- Empresa: capa assimétrica, fotografia principal e detalhe em outra escala; narrativa em colunas deslocadas.
- Atuação: índice expansível com `details` e `summary`, navegável pelo teclado.
- Destino: título ocupando a margem da fotografia, seguido de texto e mapa da cidade.
- Contato: dados e formulário diretamente na composição, sem foto decorativa ou slogan de abertura.
- Rodapé interno: assinatura estática e navegação, sem máscara, gradiente ou revelação. O rodapé da home continua original, conforme o escopo solicitado.

As imagens existentes são referências visuais da marca; não foi acrescentado um catálogo de imóveis, histórico empresarial ou dados operacionais fictícios.

## Verificação

O build executa TypeScript e Vite. `.visual-check/corporate.mjs` usa o protocolo de depuração do Edge local para revisar as páginas em 390, 1440 e 1920 pixels, menu móvel, formulário, movimento reduzido e o percurso da abertura. O caminho do navegador nesse script depende da instalação local.

A revisão editorial é verificada por `.visual-check/editorial.mjs`: páginas em três larguras, acordeão por mouse e teclado, formulário, menu móvel, movimento reduzido e comparação dos arquivos compartilhados da home. O script também registra capturas antes/depois da página inicial. Os resultados ficam em `.visual-check/editorial-results.json`.
