# Direção das seções institucionais

Pesquisa e revisão: 28/09/2026.

## O que evitar neste projeto

“AI slop” não é uma lista universal de cores ou fontes proibidas. O problema é aceitar padrões genéricos sem verificar se expressam o conteúdo e a identidade do projeto. O estudo [Interrogating Design Homogenization in Web Vibe Coding](https://arxiv.org/abs/2603.13036) analisa esse risco e propõe revisão deliberada das decisões como contraponto à geração sem atrito. É um trabalho de análise e proposta, não um teste que permite identificar a autoria de um site pela aparência.

A análise [Why AI-generated websites all look the same](https://blog.interfacekit.io/why-ai-generated-websites-all-look-the-same) também relaciona a repetição às decisões que ficam sem direção explícita. Aqui, o gradiente e a Clash Grotesk já são identidade: trocá-los para evitar um suposto clichê descaracterizaria o trabalho original.

Na versão que acrescentei à Urban Stay, os problemas concretos eram:

- Asterisco decorativo sem relação com o símbolo existente.
- Seções seguindo a mesma fórmula de título grande, texto genérico e entrada de baixo para cima.
- Roteiro com três cards e horários arbitrários, sem informação local que justificasse a estrutura.
- Serifada introduzida apenas para produzir uma aparência de luxo.
- Galeria com excesso de etiquetas, numeração e frases auxiliares.

## Referências observadas

- [DDD Hotel — Awwwards](https://www.awwwards.com/sites/ddd-hotel), com inspeção do [site](https://dddhotel.jp/en/). Fotografia e texto ocupam planos sobrepostos; escala, espaço vazio e transição constroem a experiência. Aplicação: composição assimétrica de título e imagem na apresentação institucional, sem copiar paleta ou tipografia.
- [Casa Lunara — Awwwards](https://www.awwwards.com/sites/casa-lunara). A apresentação no Awwwards destaca uma direção visual própria e uma cena central forte. O domínio original não resolveu no navegador desta sessão; a avaliação visual se limitou à apresentação no Awwwards. Aplicação: dar protagonismo à fotografia na galeria. Não importar o 3D nem a linguagem de produto de moda.
- [Hotel Lorünser — estudo de caso da Teel](https://teelstudio.com/work/hotel-lorunser). O estúdio descreve fotografia, tipografia e microinterações como extensão da identidade do hotel e registra uma menção honrosa no Awwwards. Aplicação: preservar a identidade existente e usar movimento com moderação. A inspeção foi do estudo de caso, não uma auditoria do site inteiro.

## Implementação

Apresentação com fotografia do jornal e texto assimétrico; galeria com miniaturas reais, seleção por toque/clique/teclado e transição por recorte; destino com composição tipográfica do nome da cidade e abertura da fotografia durante a rolagem. FAQ mais compacto. Sem autoplay, cursor personalizado, efeito de inclinação, contadores ou novos CTAs de reserva.

Movimento reduzido desativa os deslocamentos e a transição de recorte das novas seções. O rodapé continua simples e mantém os links legais.

Stage, Memoir, Voices, Loader, Nav, App e styles.css foram registrados por hash antes da revisão para verificar que seus arquivos não foram alterados. Em design.ts, a revisão limita-se aos conteúdos institucionais acrescentados nesta conversa.
