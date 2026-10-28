# Panni Padaria Artesanal — site

Site da **Panni Padaria Artesanal**, padaria na Zona Norte de São Paulo, com unidades em Água Fria (Rua Ismael Neri, 485) e na Casa Verde (Av. Braz Leme, 606).

Página única, estática (HTML, CSS e JavaScript puros, sem build), pronta para o GitHub Pages.

## O que tem

- **Abertura** com o slogan da casa, chamadas para o cardápio e para o pedido online, e o aviso "aberto agora" calculado pelo horário de São Paulo (muda ao longo do dia: café da manhã, almoço executivo, brunch, pizza + vinho).
- **O dia na Panni**: abas de manhã, almoço, tarde e noite com uma régua de horário. A página abre no período atual.
- **Vitrine**: pães, croissants (tradicional, queijo e presunto, chocolate Callebaut), cafés, pizza romana e o balcão.
- **À noite**: a promoção de segunda a quarta após as 19h, fatia de pizza romana + taça de vinho por R$ 39,90 (margherita, abobrinha, calabresa).
- **O salão**: Wi-Fi e tomadas para quem trabalha de lá.
- **Eventos**: Espazio Napoli (40 sentados / 60 em pé) e Estanza Firenze (15 sentados / 20 em pé), com link para agendar degustação e visita.
- **Unidades**: endereço, telefone e rota no Google Maps das duas casas.
- Tema claro e escuro automático, menu em gaveta no celular, navegação por teclado, foco visível, textos alternativos e `prefers-reduced-motion` respeitado.
- Dados estruturados (schema.org `Bakery`) das duas unidades para o Google.

Referência estética: [Saint Tropez Experience](https://apxweb.github.io/saint-tropez-experience/) (janelas em arco, serifada de título grande, abertura animada).

## Estrutura

```
index.html              página e textos
assets/css/styles.css   identidade visual e layout (cores no bloco :root do topo)
assets/js/app.js        menu do celular, abas do dia e aviso "aberto agora"
assets/img/             fotos e favicon
```

## Antes de publicar

| Item | Situação | Onde mudar |
| --- | --- | --- |
| Cores | **provisórias** (farinha, crosta dourada, oliva e vinho): as oficiais não puderam ser lidas do site atual | bloco `:root` no topo de `assets/css/styles.css` |
| Logo | o nome "Panni" está escrito em fonte; não há arquivo do logo | `.marca` em `index.html` |
| Fotos | **de banco de imagens** (Unsplash), só para a prévia | substitua os arquivos em `assets/img/` mantendo os nomes |
| Horário | o site antigo diz 7h30–20h num lugar e 8h–22h em outro; usamos **8h às 22h** | `index.html` (selo, salão, unidades, schema) e `ABRE`/`FECHA` em `assets/js/app.js` |
| WhatsApp | números não informados; o contato mostra só os telefones fixos | seção Unidades em `index.html` |
| Cardápio | sem preços além da promoção; os botões levam ao cardápio e ao pedido online atuais | links em `index.html` |

Dados da casa tirados do site atual (pannipadaria.com.br) em out/2026.

## Rodar localmente

Abra `index.html` no navegador, ou sirva a pasta:

```bash
py -m http.server 8417
```

## Publicar no GitHub Pages

No repositório: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
