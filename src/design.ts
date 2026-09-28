/**
 * Geometry lifted verbatim from the Figma file
 * "DS Urban Stay®" — frames 9068:838 (hero), 9068:893 (wheel open)
 * and 9068:919 (benefícios).
 *
 * Every number below is expressed in the 1440 x 960 art-board space.
 * At a 1440px-wide viewport the rendered layout is 1:1 with the design.
 */

export const FRAME_W = 1440
export const FRAME_H = 960

/**
 * O grid do arquivo: 1440 de largura, 12 colunas, margem 32, gutter 32.
 * Coluna = (1440 − 2·32 − 11·32) / 12 = 85.3333
 */
export const GRID = {
  width: FRAME_W,
  columns: 12,
  margin: 32,
  gutter: 32,
} as const

export const COLUMN =
  (GRID.width - GRID.margin * 2 - GRID.gutter * (GRID.columns - 1)) / GRID.columns

/** Largura de um bloco de `n` colunas, gutters incluidos. */
export const span = (n: number) => n * COLUMN + (n - 1) * GRID.gutter

/** Borda esquerda da coluna `n` (1-indexada). */
export const columnX = (n: number) => GRID.margin + (n - 1) * (COLUMN + GRID.gutter)

/** Native card size of the wheel photos (Rectangle 568…573). */
export const CARD_W = 344.524
export const CARD_H = 496.611

/** Raio dos cards: 6 na roda, 4.715 na linha de beneficios. */
export const RADIUS_WHEEL = 6
export const RADIUS_ROW = 4.715

export type Photo = {
  id: string
  src: string
  alt: string
  /** object-position, mirrors the Figma image fill alignment */
  fit: string
}

/** A resting slot of the open wheel — centre point relative to the frame centre. */
export type Slot = { x: number; y: number }

export type Benefit = {
  title: string
  lead: string
}

export type CardSpec = {
  photo: Photo
  /** frame 9068:893 — posicao na roda aberta */
  slot: Slot
  /** o beneficio que este card apresenta quando encosta na margem */
  benefit: Benefit
  /** paint order, higher sits on top */
  depth: number
}

/*
 * Wheel slots. As tres colunas encostam nas margens do grid:
 *   left   x = 32 (margem)             → centre −515.738
 *   centre x = (1440 − 344.524)/2       → centre 0
 *   right  x = 1440 − 32 − 344.524      → centre +515.738
 * A largura 344.524 vem da propria arte, nao de uma contagem de colunas.
 */
const COL_L = -515.738
const COL_C = 0
const COL_R = 515.738

/* ------------------------------------------------------------------
   Frame 9068:919 — esteira horizontal
   ------------------------------------------------------------------
   Margem esquerda 32, gutter 32, alinhamento vertical pelo centro.
   Só o primeiro card é grande; os cinco seguintes têm o mesmo tamanho.
   As proporções batem com a arte original (344.524 / 496.611 = 0.6938),
   então cada card continua sendo uma escala uniforme — nada deforma.
*/
export const ROW_TOP = 67.15
export const ROW_GAP = GRID.gutter
export const ROW_LEAD_W = 436.157
export const ROW_LEAD_H = 628.695
export const ROW_W = 321.206
export const ROW_H = 463

/**
 * A esteira e uma fita de 12 posicoes: os 6 cards que vem da roda mais 6
 * ecos das mesmas fotos. Os ecos so existem para que, quando o ultimo card
 * encostar na margem, ainda haja esteira a direita em vez de vazio.
 */
export const ROW_SLOTS = 12

/** Centro vertical da esteira — todo card cresce e encolhe em torno dele. */
export const ROW_CENTER_Y = ROW_TOP + ROW_LEAD_H / 2

/** Topo do bloco de texto, 64 abaixo do card grande. */
export const COPY_TOP = ROW_TOP + ROW_LEAD_H + 64 // 759.845

/**
 * Altura total da composição de benefícios, usada para encolher tudo
 * proporcionalmente quando a janela é mais baixa que o art-board.
 * (título 80 · 0.9 + gap 20 + lead 24 · 1.4 ≈ 125.6)
 */
export const BENEFITS_H = COPY_TOP + 125.6 // 885.4

/*
 * A ORDEM DESTE ARRAY E A ORDEM DA ESTEIRA.
 *
 * Ela segue o sentido de giro da roda, para que a transicao seja um
 * varrimento continuo em vez de seis trajetorias que se cruzam. Angulos dos
 * slots (y positivo para baixo), em sentido horario a partir do topo-esquerda:
 *
 *   −147.4°  topo-esquerda    mala
 *    −90.0°  topo-centro      cama
 *    −32.6°  topo-direita     roupao
 *     33.1°  base-direita     cartas
 *     90.0°  base-centro      camera
 *    147.0°  base-esquerda    janela
 */
export const CARDS: CardSpec[] = [
  {
    photo: {
      id: 'suitcase',
      src: '/img/suitcase.png',
      alt: 'Hóspede saindo da suíte com a mala',
      fit: '50% 50%',
    },
    slot: { x: COL_L, y: -330.0145 },
    benefit: {
      title: 'Checkout até as 14h.',
      lead: 'A gente entende que você dormiu tarde.',
    },
    depth: 6,
  },
  {
    photo: {
      id: 'bed',
      src: '/img/bed.png',
      alt: 'Cama desfeita na luz da manhã',
      fit: '50% 100%',
    },
    slot: { x: COL_C, y: -557.4345 },
    benefit: {
      title: 'Café sem hora marcada.',
      lead: 'A cozinha acorda quando você acorda.',
    },
    depth: 5,
  },
  {
    photo: {
      id: 'robe',
      src: '/img/robe.png',
      alt: 'Hóspede pulando na cama de roupão',
      fit: '50% 50%',
    },
    slot: { x: COL_R, y: -330.0145 },
    benefit: {
      title: 'Roupão é traje social.',
      lead: 'Ninguém aqui liga para o seu look.',
    },
    depth: 4,
  },
  {
    photo: {
      id: 'cards',
      src: '/img/cards.png',
      alt: 'Jogo de cartas no tapete da suíte',
      fit: '50% 50%',
    },
    slot: { x: COL_R, y: 335.7055 },
    benefit: {
      title: 'A noite continua aqui.',
      lead: 'Baralho, vitrola e gelo à disposição.',
    },
    depth: 3,
  },
  {
    photo: {
      id: 'camera',
      src: '/img/camera.png',
      alt: 'Casal fotografando na cama',
      fit: '50% 50%',
    },
    slot: { x: COL_C, y: 539.0155 },
    benefit: {
      title: 'Cada canto é cenário.',
      lead: 'Traz a câmera. A luz trabalha a seu favor.',
    },
    depth: 2,
  },
  {
    photo: {
      id: 'window',
      src: '/img/window.png',
      alt: 'Silhueta em frente à janela ao entardecer',
      // a origem e 16:9; o recorte vertical do Figma centraliza a silhueta
      fit: '68% 50%',
    },
    slot: { x: COL_L, y: 335.7055 },
    benefit: {
      title: 'Vista que segura o dia.',
      lead: 'O mar começa na sua janela.',
    },
    depth: 1,
  },
]

/** Copy do hero — frame 9068:838. */
export const HERO = {
  title: 'Veja a vida pela nossa moldura',
  lead: 'No centro de Balneário. A dois passos da praia, a dois passos da noite.',
} as const

/* ------------------------------------------------------------------
   Frame 9111:4 — "A parte da viagem que ninguém lembra de contar"
   Art-board de 1440 x 1607. Titulo justificado ocupando a largura toda;
   as quatro fotos moram dentro dos vaos que a justificacao abre.
   ------------------------------------------------------------------ */

/**
 * Titulo — node 9111:23.
 *
 * As quebras vem do arquivo e sao fixas: deixar o navegador quebrar sozinho
 * nao garante as mesmas seis linhas, e sao os vaos da justificacao que
 * abrigam as fotos. Posicao, corpo e tracking ficam no CSS, como no resto
 * do projeto.
 */
export const MEMOIR_TITLE = {
  lines: ['A parte', 'da viagem', 'que', 'ninguém', 'lembra', 'de contar'],
} as const

/**
 * Fotos — nodes 9111:22 / :24 / :25 / :26.
 *
 * `crop` e o enquadramento do proprio Figma, ja em porcentagem da moldura:
 * a imagem entra com `width: 100%`, altura `crop.h%` e deslocada `crop.y%`
 * para cima. Como e tudo relativo, sobrevive a escala sem distorcer.
 */
export const MEMOIR_PHOTOS = [
  {
    id: '9111:24',
    src: '/img/memoir-terrace.png',
    alt: 'Casal brindando na varanda ao entardecer',
    x: 261.39,
    y: 29.6,
    w: 365.941,
    h: 178.721,
    crop: { y: -139.62, h: 272.91 },
  },
  {
    id: '9111:22',
    src: '/img/memoir-bath.png',
    alt: 'Pés apoiados na borda da banheira',
    x: 577.47,
    y: 500.76,
    w: 836.354,
    h: 185.533,
    crop: { y: -386.68, h: 676.18 },
  },
  {
    id: '9111:26',
    src: '/img/memoir-sunset.png',
    alt: 'Jantar a dois com o mar ao fundo',
    x: 1178.51,
    y: 746.56,
    w: 235.319,
    h: 178.721,
    crop: { y: -11.3, h: 164.48 },
  },
  {
    id: '9111:25',
    src: '/img/memoir-paper.png',
    alt: 'Jornal aberto na poltrona do quarto',
    x: 1072.65,
    y: 985.55,
    w: 341.181,
    h: 178.721,
    crop: { y: -63.54, h: 285.96 },
  },
]

/**
 * Os dois paragrafos do rodape do frame — nodes 9111:19 e 9111:20.
 * O `y` e o topo da caixa de texto aparada (cap-height), nao o topo da
 * linha: os dois blocos comecam na mesma altura no arquivo.
 */
export const MEMOIR_COPY = [
  {
    id: '9111:19',
    x: 32,
    w: 672.219,
    text: 'Você volta lembrando do bar cheio, da praia lotada, da fila do posto às três da manhã. Do quarto, nunca. Aqui a gente cuidou de tudo.',
  },
  {
    id: '9111:20',
    x: 736,
    w: 672,
    text: 'O ar frio quando a porta abre e o cheiro chega antes de você, o banho depois da areia, a cama depois das cinco.',
  },
]

/* ------------------------------------------------------------------
   Frame 9111:2336 — "Quem já dormiu aqui"
   Art-board de 1440 x 778. Titulo centrado e uma fileira de quatro
   depoimentos de 320, com gutter de 32, ancorada na margem de 32.
   ------------------------------------------------------------------ */

export const VOICES_TITLE = 'Quem já dormiu aqui'

/**
 * Os depoimentos — nodes 9111:2388 / 9114:2440 / :2454 / :2468 sao os
 * quatro primeiros; o resto e a mesma ficha repetida na fileira.
 *
 * No arquivo os quatro cards trazem o mesmo texto e a mesma pessoa. Aqui
 * cada um recebe um placeholder proprio — nome, procedencia, foto e
 * citacao ficticios — so para a fila ler como fila de verdade enquanto os
 * depoimentos reais nao chegam. Nada de layout depende do conteudo, e o
 * carrossel aceita qualquer quantidade: e so acrescentar itens na lista.
 *
 * A segunda linha e cidade e mes da estadia, nao cargo e empresa: isto e
 * suite de casal, nao hotel de convencao. E o que hospedagem usa para dar
 * lastro ao depoimento — e some sem tocar no layout se nao interessar.
 *
 * As fotos sao avatares de demonstracao (i.pravatar.cc) ja baixados para
 * `public/img`, entao nada e buscado em runtime.
 */
export const VOICES = [
  {
    id: '9111:2388',
    quote:
      '“Chegamos tarde da estrada e o quarto já estava pronto. Dormimos como não dormíamos há meses.”',
    name: 'Marina Duarte',
    stay: 'Curitiba · mar 2026',
    avatar: '/img/voices-avatar-1.jpg',
  },
  {
    id: '9114:2440',
    quote:
      '“A dois quarteirões de tudo, mas quando a porta fecha parece outro mundo. Já reservamos a próxima.”',
    name: 'Rafael Menezes',
    stay: 'Porto Alegre · jan 2026',
    avatar: '/img/voices-avatar-2.jpg',
  },
  {
    id: '9114:2454',
    quote:
      '“Café às sete, mar pela janela, e ninguém para incomodar. Não saímos do prédio no primeiro dia.”',
    name: 'Camila Sato',
    stay: 'São Paulo · fev 2026',
    avatar: '/img/voices-avatar-3.jpg',
  },
  {
    id: '9114:2468',
    quote:
      '“Cada detalhe pensado — da luz da manhã à louça. Difícil achar isso em Balneário.”',
    name: 'Thiago Albuquerque',
    stay: 'Belo Horizonte · jul 2026',
    avatar: '/img/voices-avatar-4.jpg',
  },
  {
    id: 'voice-5',
    quote:
      '“Eram quatro noites e viraram seis. Nenhum de nós dois quis ir embora no domingo.”',
    name: 'Letícia Prado',
    stay: 'Florianópolis · jun 2026',
    avatar: '/img/voices-avatar-5.jpg',
  },
  {
    id: 'voice-6',
    quote:
      '“Voltamos do mar, subimos de elevador e o banho quente esperando. É esse o luxo, no fim.”',
    name: 'Bruno Tavares',
    stay: 'Rio de Janeiro · abr 2026',
    avatar: '/img/voices-avatar-6.jpg',
  },
  {
    id: 'voice-7',
    quote:
      '“Reservei em cima da hora e responderam em minutos. Chegar foi a parte fácil.”',
    name: 'Juliana Reis',
    stay: 'Londrina · mai 2026',
    avatar: '/img/voices-avatar-7.jpg',
  },
  {
    id: 'voice-8',
    quote:
      '“A vista da varanda às seis da manhã paga a viagem sozinha. Voltamos no aniversário.”',
    name: 'André Kowalski',
    stay: 'Joinville · fev 2026',
    avatar: '/img/voices-avatar-8.jpg',
  },
]

export const NAV_LINKS = [
  { label: 'Empresa', href: '/empresa.html' },
  { label: 'Atuação', href: '/atuacao.html' },
  { label: 'Destino', href: '/destino.html' },
  { label: 'Contato', href: '/contato.html' },
]

/** Desdobramento institucional: composição derivada do grid de 9068:919.
 * Conteúdo editorial novo, sem atribuir coordenadas a nodes inexistentes. */
export const INSTITUTIONAL = {
  about: {
    titleLines: ['O tempo', 'é seu.'],
    body: 'Ler o jornal pela metade. Deixar o café esfriar. Decidir sair e mudar de ideia.',
    closing: 'A Urban Stay olha para essa parte da viagem: o tempo que você passa sem precisar chegar a lugar nenhum.',
  },
  stays: {
    title: 'Ficar.',
  },
  location: {
    titleLines: ['Balneário', 'Camboriú.'],
    body: 'A orla marca o caminho. Os prédios recortam o céu. Entre um e outro, a cidade acontece — e você escolhe onde entrar.',
    link: 'Abra o mapa da cidade',
  },
  faqTitle: 'Quer saber mais?',
  faq: [
    { question: 'O que inspira a Urban Stay?', answer: 'O encontro entre a vida urbana e o tempo de descanso. A marca explora os pequenos momentos de uma viagem: a luz da manhã, uma conversa demorada e a liberdade de mudar os planos.' },
    { question: 'Qual é a relação com Balneário Camboriú?', answer: 'Balneário Camboriú é o cenário da Urban Stay. O mar, a arquitetura e a vida da cidade fazem parte da identidade da marca.' },
    { question: 'O que encontro neste site?', answer: 'Uma apresentação da marca, de suas referências e do destino. As imagens e os textos compõem o universo visual da Urban Stay.' },
  ],
} as const

/** Novas composições derivadas de 9068:919 e 9111:4; sem nodes próprios no Figma. */
export const JOURNEY = {
  rooms: [
    { title: 'A manhã pode esperar.', label: 'Cama', image: '/img/bed.png', alt: 'Sorvete na cama, sob a luz da manhã', text: 'O lençol ainda amassado, a luz atravessando o quarto. Lá fora já é dia. Aqui, ainda cabe mais um pouco.' },
    { title: 'A última partida. De novo.', label: 'Encontro', image: '/img/cards.png', alt: 'Um jogo de cartas no tapete do quarto', text: 'As cartas no tapete e uma conversa que vai longe. Ninguém está contando as horas.' },
    { title: 'Perto da janela.', label: 'Vista', image: '/img/window.png', alt: 'Silhueta junto à janela com vista para o mar', text: 'A cidade continua em movimento. Você pode só olhar.' },
  ],
} as const

export const LEGAL_LINKS = [
  { label: 'Privacidade', href: '/privacidade.html' },
  { label: 'Cookies', href: '/cookies.html' },
  { label: 'Termos de uso', href: '/termos-de-uso.html' },
] as const

/** Escalas novas derivadas dos frames 9068:919 / 9111:4, sem nodes próprios. */
export const EDITORIAL_LAYOUT = {
  aboutTitle: 180,
  aboutPhotoHeight: 760,
  staysTitle: 164,
  staysPhotoHeight: 780,
  destinationTitle: 190,
  destinationPhotoHeight: 620,
  compactAboutTitle: 140,
  compactAboutPhotoHeight: 640,
  compactStaysTitle: 150,
  compactStaysPhotoHeight: 860,
  compactDestinationTitle: 108,
} as const

/** Expansão editorial do grid 9068:919; páginas novas, sem nodes próprios. */
export const CORPORATE = {
  eyebrow: 'Hospitalidade · Identidade · Cidade',
  homeTitle: 'Uma marca.\nMuitas conexões.',
  homeBody: 'Conheça a Urban Stay, nossa visão de hospitalidade e os caminhos para construir novas relações com a marca.',
  intro: 'A Urban Stay aproxima a experiência de estar em uma cidade do cuidado com o tempo de cada pessoa. Balneário Camboriú faz parte dessa perspectiva: urbana, aberta e conectada ao mar.',
  pages: {
    empresa: { label: 'Empresa', title: 'Um olhar próprio\nsobre estar.', description: 'Nossa identidade, nossos princípios e a visão que orienta a Urban Stay.', image: '/img/memoir-paper.png', alt: 'Jornal e luz natural em um ambiente de descanso' },
    atuacao: { label: 'Atuação', title: 'Hospitalidade\nem perspectiva.', description: 'Experiência, marca e relações: conheça os temas que aproximam a Urban Stay de pessoas e negócios.', image: '/img/memoir-terrace.png', alt: 'Encontro na varanda ao entardecer' },
    destino: { label: 'Destino', title: 'A cidade faz\nparte de nós.', description: 'Balneário Camboriú como contexto para pensar o encontro entre vida urbana e hospitalidade.', image: '/img/window.png', alt: 'Vista da cidade e do mar pela janela' },
    contato: { label: 'Contato', title: 'Boas relações\ncomeçam aqui.', description: 'Um espaço para conversas comerciais, parcerias e assuntos institucionais.', image: '/img/cards.png', alt: 'Cartas sobre o tapete em um momento de encontro' },
  },
  principlesTitle: 'O que orienta a marca.',
  principles: [
    { title: 'Tempo com significado', text: 'Pensar a hospitalidade a partir das pessoas e da liberdade de viver cada momento no próprio ritmo.' },
    { title: 'Identidade em cada detalhe', text: 'Buscar coerência entre a forma como a marca se apresenta, os ambientes que a inspiram e as relações que constrói.' },
    { title: 'Conexão com o lugar', text: 'Valorizar a cidade como parte da experiência, com sua arquitetura, seus encontros e sua vida cotidiana.' },
  ],
  areasTitle: 'Diferentes formas de se conectar.',
  areas: [
    { title: 'Hospitalidade', text: 'O olhar da Urban Stay sobre os espaços, os pequenos rituais e o tempo de uma estadia.', link: 'Conhecer nossa visão', href: '/empresa.html' },
    { title: 'Parcerias de marca', text: 'Um ponto de partida para propor colaborações, projetos e iniciativas que dialoguem com o universo da marca.', link: 'Propor uma parceria', href: '/contato.html?assunto=Parcerias' },
    { title: 'Relações comerciais', text: 'Um canal para apresentar sua empresa, compartilhar uma proposta e iniciar uma conversa sobre possibilidades de colaboração.', link: 'Iniciar uma conversa', href: '/contato.html?assunto=Comercial' },
  ],
  destination: [
    { title: 'Entre a arquitetura e o mar', text: 'O contraste entre a paisagem construída e a linha do horizonte dá à cidade uma identidade própria. É nesse encontro que a Urban Stay encontra parte de suas referências.' },
    { title: 'Um lugar de encontros', text: 'A cidade é também feita de conversas, pausas e trajetos cotidianos. Nosso olhar vai além da paisagem para considerar as relações que dão sentido a estar aqui.' },
  ],
  nextTitle: 'Vamos abrir\nessa conversa?',
  nextBody: 'Apresente sua empresa, compartilhe uma ideia ou conheça as possibilidades de conexão com a Urban Stay.',
  contactLabel: 'Fale com a Urban Stay',
  contact: {
    email: 'comercial@urbanstay.example', phone: '+55 (00) 00000-0000', company: '[Razão social da Urban Stay]', registration: '[CNPJ a informar]', address: '[Endereço comercial a informar] · Balneário Camboriú, SC',
    notice: 'Dados de demonstração. Os canais oficiais serão informados em breve.',
    formTitle: 'Apresente sua proposta.', formBody: 'Prepare uma mensagem para nossa equipe. Neste protótipo, você pode copiar o resumo; nenhum dado é enviado.',
    name: 'Seu nome', organization: 'Empresa', reply: 'E-mail para retorno', subject: 'Assunto', message: 'Como podemos conversar?',
    subjects: ['Comercial', 'Parcerias', 'Imprensa', 'Institucional'],
    submit: 'Preparar mensagem', copy: 'Copiar mensagem', copied: 'Mensagem copiada.', copyError: 'Selecione e copie o texto abaixo.', prepared: 'Sua mensagem está pronta. Nenhum dado foi enviado.', privacy: 'Os dados ficam apenas nesta página e não são armazenados ao sair.',
  },
  footerDescription: 'Um olhar sobre hospitalidade, pessoas e o lugar onde elas se encontram.',
  footerNav: 'Explore a Urban Stay', footerContact: 'Contato comercial',
  home: 'Início', menu: 'Menu', close: 'Fechar', skip: 'Pular para o conteúdo', discover: 'Conheça a Urban Stay',
} as const

/** Escalas editoriais derivadas de 9068:919 / 9111:4; sem novos nodes. */
export const CORPORATE_LAYOUT = {
  radius: RADIUS_WHEEL, label: 14, body: 18, intro: 22, description: 24,
  footer: 26, gap: GRID.gutter, noteGap: 40, heading: 44, rowSpace: 48,
  sectionGap: GRID.gutter * 2, display: 80, breadcrumbGap: 96,
  title: EDITORIAL_LAYOUT.compactDestinationTitle, sectionSpace: 128,
  top: EDITORIAL_LAYOUT.aboutTitle, photo: EDITORIAL_LAYOUT.destinationPhotoHeight,
} as const

/** Páginas internas: nova direção editorial sobre o grid de 9068:919.
 * As composições não têm nodes próprios; as medidas são decisões editoriais.
 * Dados independentes de CORPORATE para preservar integralmente a home. */
export const INTERNAL_LAYOUT = {
  frame: FRAME_W, gutter: GRID.gutter, margin: GRID.margin,
  top: 144, space: 128, section: 192, small: 24, fine: 16,
  title: 176, display: 132, subtitle: 64, heading: 40, body: 22, label: 14,
  portrait: 680, inset: 248, panorama: 700, contactTitle: 200,
  logo: 280, compactTitle: 136, compactSpace: 96,
} as const

export const INTERNAL = {
  location: 'Balneário Camboriú, SC',
  company: {
    title: ['A Urban', 'Stay.'],
    lead: 'Hospitalidade em Balneário Camboriú.',
    photo: { src: '/img/memoir-terrace.png', alt: 'Um brinde na varanda com o mar ao fundo', caption: 'A cidade vista de dentro.' },
    inset: { src: '/img/memoir-paper.png', alt: 'Jornal aberto na poltrona junto à janela', caption: 'Uma pausa no quarto.' },
    label: 'A marca',
    statement: 'A estadia também\nfaz parte da viagem.',
    paragraphs: [
      'A Urban Stay é uma marca de hospitalidade ligada a Balneário Camboriú. O quarto, a vista e o tempo entre um passeio e outro são o ponto de partida da nossa identidade.',
      'A cidade aparece nas imagens. O descanso, nos gestos: abrir a janela, deixar a mala, ler algumas páginas. É desse cotidiano que vem o nosso jeito de falar sobre hospedagem.',
    ],
    closing: 'Do lado de fora,\nBalneário Camboriú.',
    closingText: 'O mar e a arquitetura da cidade fazem parte das referências da Urban Stay.',
    closingLink: 'Conheça o destino',
    closingPhoto: { src: '/img/memoir-sunset.png', alt: 'Mesa junto à varanda com vista para o mar ao entardecer', caption: 'Luz de fim de tarde, mar ao fundo.' },
  },
  activity: {
    title: 'Nossa atuação.',
    intro: 'Hospedagem, parcerias e assuntos comerciais. Encontre o caminho para falar com a Urban Stay.',
    label: 'Áreas de atuação',
    items: [
      { title: 'Hospitalidade', tag: 'A experiência de ficar', text: 'A hospedagem está no centro da marca. Nossas referências vêm do uso dos espaços: a cama depois da praia, a conversa na varanda, a cidade pela janela.', detail: 'Conheça a apresentação da Urban Stay e o universo que orienta sua identidade.', link: 'Sobre a Urban Stay', href: '/empresa.html', image: '/img/bed.png', alt: 'Cama desfeita iluminada pelo sol' },
      { title: 'Parcerias', tag: 'Marcas e projetos', text: 'Tem uma proposta que envolve a Urban Stay? Apresente sua marca, o projeto e o tipo de participação que você imagina.', detail: 'Inclua o escopo, o período previsto e uma pessoa de contato para a conversa.', link: 'Apresentar uma parceria', href: '/contato.html?assunto=Parcerias', image: '/img/cards.png', alt: 'Jogo de cartas no tapete do quarto' },
      { title: 'Comercial', tag: 'Empresas e fornecedores', text: 'Este é o espaço para apresentar produtos, serviços ou uma proposta comercial à Urban Stay.', detail: 'Conte o que sua empresa faz e acrescente as informações necessárias para avaliar a proposta.', link: 'Contato comercial', href: '/contato.html?assunto=Comercial', image: '/img/camera.png', alt: 'Câmera fotográfica durante uma estadia' },
    ],
  },
  destination: {
    title: ['Balneário', 'Camboriú.'],
    region: 'Santa Catarina · Brasil',
    photo: { src: '/img/window.png', alt: 'Pessoa junto à janela, com vista para os prédios e o mar', caption: 'A orla pela janela.' },
    label: 'O destino',
    statement: 'A cidade,\nlogo ali.',
    paragraphs: ['Uma faixa de mar, edifícios altos e a vida da orla. Balneário Camboriú é o cenário da Urban Stay.', 'Aqui, a paisagem urbana participa da estadia. Aparece pela janela, acompanha o café e muda com a luz do dia.'],
    mapLabel: 'Abrir mapa da cidade',
    mapHref: 'https://www.google.com/maps/search/?api=1&query=Balne%C3%A1rio+Cambori%C3%BA+Santa+Catarina',
    note: 'Mapa de Balneário Camboriú. O endereço da Urban Stay será informado no contato.',
    detailPhoto: { src: '/img/memoir-sunset.png', alt: 'Vista do mar a partir de uma mesa na varanda', caption: 'O mar acompanha a mesa.' },
  },
  contact: {
    title: 'Contato.', lead: 'Comercial, parcerias\ne imprensa.',
    note: 'Dados ilustrativos. Canais oficiais a confirmar.',
    emailLabel: 'E-mail comercial', phoneLabel: 'Telefone', addressLabel: 'Endereço', companyLabel: 'Dados da empresa',
    formTitle: 'Escreva para a Urban Stay',
    formNote: 'Formulário demonstrativo: a mensagem pode ser copiada, mas ainda não é enviada.',
    name: 'Nome', organization: 'Empresa', email: 'E-mail', subject: 'Assunto', message: 'Mensagem',
    submit: 'Revisar mensagem', privacy: 'Seus dados não são armazenados nesta demonstração.',
    summaryTitle: 'Mensagem para revisão', ready: 'Mensagem preparada. Nenhum dado foi enviado.',
    copy: 'Copiar mensagem', copied: 'Mensagem copiada.', copyError: 'Não foi possível copiar automaticamente. Selecione o texto abaixo para copiar.',
    privacyLink: 'Privacidade',
  },
  footer: {
    nextLabel: 'Continue', linksLabel: 'Navegação', legalLabel: 'Informações legais',
    signature: 'Hospitalidade em Balneário Camboriú.',
    next: { empresa: { label: 'Nossa atuação', href: '/atuacao.html' }, atuacao: { label: 'Contato', href: '/contato.html' }, destino: { label: 'A Urban Stay', href: '/empresa.html' }, contato: { label: 'A Urban Stay', href: '/empresa.html' } },
  },
} as const
