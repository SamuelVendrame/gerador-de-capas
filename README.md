# 📚 Gerador de Capas

Ferramenta **local**, com interface web, em que um **agente de IA multimodal** gera capas de livro de forma iterativa: cria a arte de fundo, monta a capa sobre layouts parametrizados e **revisa o próprio resultado** até ficar bom.

O diferencial não é "gerar uma imagem" — é o **ciclo de auto-revisão**: a IA enxerga o que produziu, identifica problemas (texto indesejado na arte, composição que briga com o título, tipografia que não cabe) e se corrige sozinha, dentro de limites de tentativa.

> 📄 Status: rascunho para implementação · Ambiente: execução local

## ✨ Como funciona

1. **Escolha do layout e prompt de imagem** — o agente escolhe um preset de layout e escreve o prompt de geração de imagem, descrevendo a composição (ex: área livre no topo para o título), sem nunca pedir texto na arte.
2. **Geração e validação da arte de fundo** — o agente gera a imagem e, sendo multimodal, analisa o resultado. Se saiu texto indevido ou composição incompatível, corrige o prompt e tenta de novo (**máx. 3 tentativas**).
3. **Montagem da capa** — com a arte aprovada, o agente chama o renderizador com os parâmetros (layout, alinhamento, fonte, imagem, textos), que devolve automaticamente um screenshot do resultado.
4. **Revisão final e iteração** — o agente analisa o print completo: o texto coube? a composição conversa com o título? Se não, ajusta parâmetros ou regenera a arte, voltando ao passo 2 ou 3, sempre respeitando os limites de tentativa.
5. **Entrega** — capa aprovada, disponível para download em **PNG e PDF**, proporção 2:3 (~1600×2400 px).

## 🧠 Princípio central

**A IA escolhe parâmetros, nunca cria estilo.** O agente nunca escreve CSS — apenas seleciona valores dentro de opções curadas (layout, alinhamento, fonte). Isso mantém a qualidade visual sob controle do sistema e torna o resultado previsível e revisável.

## 🎨 Sistema de layouts parametrizados

O componente de capa recebe parâmetros e resolve todo o resto internamente, sempre respeitando a proporção 2:3 (~1600×2400 px).

| Parâmetro | Descrição |
|---|---|
| `layout` | Preset de composição (ex: título centralizado; título no topo com autor na base) |
| `alinhamento` | Posição do bloco de texto nos dois eixos (centro/centro, esquerda vertical, etc.) |
| `fonte` | Conjunto curado de tipografias, com metadados de uso por gênero de livro |
| `imagem` | Arte de fundo gerada, aplicada como background |
| `título` / `autor` | Textos vindos do formulário |

**CSS adaptativo:**
- Fonte adaptativa — título curto usa corpo maior, título longo reduz automaticamente
- Quebra de linha inteligente — regras para o título não ficar desequilibrado

## 🚀 Tecnologias

**Frontend**
- [Nuxt](https://nuxt.com/)
- Vue 3 + TypeScript

**Backend / agente**
- Node.js + TypeScript

**IA**
- [OpenRouter](https://openrouter.ai/) — LLM multimodal (obrigatório ler imagens; provedor de modelo configurável via API key)
- [WaveSpeed](https://wavespeed.ai/) — geração da arte de fundo via API

**Saída**
- PNG e PDF, proporção 2:3 (~1600×2400 px)

## 📦 Instalação

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as chaves de API dos serviços externos:

```bash
OPENROUTER_API_KEY=sua_chave_aqui
WAVESPEED_API_KEY=sua_chave_aqui
```

## 💻 Rodando em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## 🔨 Build para produção

```bash
npm run build
npm run preview
```

> Deploy/hospedagem estão fora do escopo do projeto — o uso previsto é execução local.

## 📁 Estrutura do projeto

```
.
├── components/       # Componentes Vue (presets de layout de capa)
├── server/           # Lógica do agente, integrações OpenRouter/WaveSpeed
├── pages/            # Páginas Nuxt (formulário e acompanhamento da geração)
├── public/           # Assets estáticos (fontes, imagens)
├── nuxt.config.ts    # Configuração do Nuxt
└── README.md
```

## ✅ Escopo

**Incluído**
- Interface web local, sem login
- Biblioteca de layouts de capa parametrizados (componentes Vue)
- Agente de IA multimodal com loop de auto-revisão
- Geração de imagem de fundo via serviço externo
- Renderização do componente + captura de screenshot automática
- Entrega da capa final em PNG e PDF

**Fora do escopo**
- Login, autenticação e multiusuário
- Deploy em produção / hospedagem
- Cobrança e créditos
- Edição manual da capa (editor visual)
- Miolo do livro, diagramação ou revisão de texto

## 🎯 Critérios de aceite

- Informando título, autor e tema, o sistema entrega uma capa completa sem intervenção manual no meio do processo
- A arte de fundo nunca contém texto — título e autor vêm exclusivamente do componente
- Erros na arte gerada (ex: texto indevido) são detectados e corrigidos automaticamente, dentro do limite de tentativas
- A composição da arte respeita o layout, deixando a área do título visualmente livre
- Títulos curtos e longos renderizam corretamente no mesmo preset
- Ao esgotar os limites de tentativa, o sistema para e informa o erro, sem consumir chamadas indefinidamente
- Trocar o modelo de LLM via OpenRouter não exige mudança de código, apenas configuração

## 📄 Licença

Defina aqui a licença do projeto (ex: MIT).