# Fotografia e scroll mobile — 06/10/2026

Direção: descanso íntimo, luz de janela, tecidos claros, tons de areia e azul,
gestos cotidianos. As fotos são referências editoriais de banco, não um registro
dos imóveis da Urban Stay. Seleção autorizada pelo cliente nesta revisão.

## Fotos substituídas

| Arquivo | Autor | Fonte |
| --- | --- | --- |
| suitcase | American Green Travel | https://unsplash.com/photos/zpBazuFSMXA |
| bed | Masaaki Komori | https://unsplash.com/photos/CdAPY_g_SBQ |
| cards | Boris Pavlikovsky | https://www.pexels.com/photo/6803654/ |
| camera | Ethan Chan | https://unsplash.com/photos/eZT7T02Eivk |

Licenças consultadas em 06/10/2026: https://unsplash.com/license e
https://www.pexels.com/license/. Fotografias gratuitas para uso no site;
não apresentar as pessoas como endossantes da marca.

Roupão e janela mantêm as imagens existentes. Os PNGs originais foram preservados.
As seis fotografias da abertura têm derivados WebP em 480, 800 e 1000 pixels,
recortados na proporção das molduras. A janela mantém o ponto focal em 68%.
O navegador escolhe o tamanho considerando largura e densidade da tela.
As quatro novas imagens também substituem as referências nas páginas internas.

## Rolagem

- Mobile: track de 620svh, com 520svh de percurso útil; desktop continua 820/720.
- A abertura passa de 316,8svh para 116,8svh. A esteira mantém 403,2svh.
- Todos os marcos e sobreposições originais são preservados por remapeamento.
- O título começa a sair após 87,6svh no mobile (antes: 237,6svh).
- Medidas e elementos das máscaras são preparados fora do ciclo de desenho.
- O sticky fornece a altura de referência, evitando depender da barra móvel.
- Dispositivos com ponteiro de toque usam rolagem nativa, sem ticker do Lenis.
- As seis fotos da roda carregam desde a abertura; apenas os ecos são lazy.
- Texto auxiliar e botão têm tamanhos mínimos legíveis no mobile, e os
  benefícios podem quebrar linha para não cortar o conteúdo.

## Verificação manual

Percorrer nascimento → roda → desenrolar → seis benefícios → rodapé, e voltar.
Verificar larguras 360, 390, 1440 e 1920; rotação do celular; primeira visita com
cache vazio; menu e links internos. Em aparelho físico, conferir o gesto de toque
e a barra de endereço dinâmica, que uma janela desktop estreita não reproduz.

## Retomada e validação — 06/10/2026

- Dependências instaladas e compilação de produção concluída sem erros.
- Confirmado no navegador: as seis fotos iniciais carregam variantes WebP de
  480px na largura de 390px; abertura e trechos da esteira conferidos no mobile
  e desktop. Menu móvel e acesso à página Empresa conferidos em 360px.
- A rolagem suave agora acompanha alterações de preferência de movimento
  reduzido e de tipo de ponteiro sem exigir recarregamento. Os listeners e o
  ticker anterior são removidos antes de recriar a instância.
- Ainda pendentes: teste em aparelho físico com barra de endereço dinâmica,
  percurso completo de ida e volta em cada largura e alternância da preferência
  de movimento no sistema durante uma sessão.
