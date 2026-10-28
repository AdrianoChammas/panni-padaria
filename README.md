# Panni Padaria Artesanal — site

Site da **Panni Padaria Artesanal**, padaria na Zona Norte de São Paulo com duas casas: **Água Fria** (Rua Ismael Neri, 485) e **Casa Verde** (Av. Braz Leme, 606).

Estático (HTML, CSS e JavaScript puros, sem build), pronto para o GitHub Pages.

## O que tem

Uma página de entrada e uma página para cada casa, cada uma com a sua cor.

- **Página inicial** (`index.html`)
  - As duas casas lado a lado como "portas": a que está sob o cursor se abre, a foto acompanha o mouse e mostra o resumo da casa. No celular, as portas ficam uma sobre a outra.
  - Farinha caindo sobre as portas, que se afasta do cursor (ou do dedo).
  - Quem somos, com o jeito de cada casa; o dia na Panni (abas de manhã, almoço, tarde e noite, abrindo no período atual); a promoção pizza + vinho; um cardápio por casa; endereço, telefone e WhatsApp das duas unidades.
- **Água Fria** (`agua-fria/`), em tom de tijolo: abertura com a fachada do casarão, a casa, o salão (faixa de fotos com setas), à mesa, **eventos** (Espazio Napoli e Estanza Firenze), visita com horário da semana e mapa.
- **Casa Verde** (`casa-verde/`), em verde com o dourado das lâmpadas: abertura com a fachada à noite, a casa, o salão, a calçada (drinks e vinho), à mesa, visita e mapa.
- **Cardápio de cada casa** (`agua-fria/cardapio.html`, `casa-verde/cardapio.html`): as páginas do cardápio impresso, que abrem em tamanho grande.
- Seletor "Água Fria | Casa Verde" sempre no cabeçalho. Ao trocar de casa, uma cortina na cor do destino cobre a tela com o logo.
- Aviso "aberto agora" pelo horário de São Paulo; o dia de hoje fica marcado no horário da semana.
- O mapa do Google só carrega quando a pessoa clica em "Mostrar o mapa".
- Tema claro e escuro automático, navegação por teclado, foco visível, textos alternativos. Com `prefers-reduced-motion`, cortina, farinha e efeitos de cursor ficam desligados.
- Dados estruturados (schema.org `Bakery`) de cada unidade.

Referência: [Famiglia Mancini, proposta 2](https://apxweb.github.io/famiglia-mancini-proposta-2/) (uma página por casa, cor por casa, transição entre casas, cena que reage ao cursor).

## Estrutura

```
index.html                 página inicial: as duas casas
agua-fria/index.html       unidade Água Fria (com eventos)
agua-fria/cardapio.html    cardápio de Água Fria
casa-verde/index.html      unidade Casa Verde
casa-verde/cardapio.html   cardápio da Casa Verde
assets/css/styles.css      identidade visual; cores no :root do topo, cor de cada casa em [data-casa]
assets/js/app.js           menu, abas, aviso de horário, cortina, portas, inclinação dos cartões, farinha, mapa
assets/img/                fotos (af-* Água Fria, cv-* Casa Verde, mesa-*, cardapio-*), logo e favicon
```

## Fotos

As fotos das casas, dos pratos (`mesa-*`), dos cardápios e o logo vêm do acervo do site atual (pannipadaria.com.br, biblioteca de mídia do WordPress). Foram convertidas para WebP em dois tamanhos (o menor para celular).

Para trocar ou acrescentar uma foto, mantenha o nome do arquivo ou gere os dois tamanhos (por exemplo `af-salao-900.webp` e `af-salao-1800.webp`). Fotos horizontais em boa resolução, com 1800 px de largura ou mais, ficam melhores nas aberturas.

## Antes de publicar

| Item | Situação | Onde mudar |
| --- | --- | --- |
| Fotos de banco | `croissant.jpg`, `pizza.jpg`, `pizza-margherita.jpg` e `vinho.jpg` ainda são do Unsplash: não há fotos desses produtos no acervo | `assets/img/`, mantendo os nomes |
| Fotos dos salões de eventos | Estanza Firenze usa a sala climatizada com varanda (bate com a descrição); para o Espazio Napoli usamos a mesa de bolo decorada. **Confirmar com a casa** | seção Eventos em `agua-fria/index.html` |
| Cardápio Casa Verde | as imagens são de abril de 2023; os preços podem ter mudado. O de Água Fria é de agosto de 2026 | `assets/img/cardapio-cv-*.webp` |
| Horário | o rodapé do site antigo diz 7h30–20h; as páginas das unidades dizem **8h às 22h**, que é o que usamos | páginas das casas (seção Visita), schema e `ABRE`/`FECHA` em `assets/js/app.js` |
| WhatsApp | do site antigo: Água Fria (11) 2476-1341, Casa Verde (11) 3856-9390, eventos (11) 97552-2523. Confirmar se o de eventos é WhatsApp | links `wa.me` nas páginas |
| Pedir online | o mesmo link do cardápio digital nas duas casas; confirmar se atende as duas | links `cardapiodigital.io` |
| Cores | provisórias (tijolo e verde por casa, farinha e vinho no geral) | `:root` e `[data-casa]` em `assets/css/styles.css` |
| Vídeo | o site atual tem um vídeo (`RENDER_PANNI.mp4`, 141 MB): grande demais para o Pages sem compressão | — |

Dados da casa tirados do site atual (pannipadaria.com.br) em out/2026.

## Rodar localmente

As páginas das casas usam endereços de pasta (`agua-fria/`), então sirva a pasta em vez de abrir o arquivo direto:

```bash
py -m http.server 8417
```

e abra `http://localhost:8417`.

## Publicar no GitHub Pages

No repositório: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
