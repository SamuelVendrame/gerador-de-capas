Gerador de Capas de Livros com IA

Ferramenta local, com interface web, em que um agente de IA multimodal gera capas de livros de forma iterativa: cria a arte de fundo, monta a capa sobre layouts prontos e revisa o próprio resultado até ficar bom.

Stack: Nuxt/Vue 3/TypeScript no front, Node.js no back, OpenRouter para o modelo de IA e WaveSpeed para geração de imagem.

Como rodar
bash
npm install
npx playwright install chromium
npm run dev

Cria um .env na raiz com:

OPENROUTER_API_KEY=sua_chave_aqui
WAVESPEED_API_KEY=sua_chave_aqui

Acessa em http://localhost:3000.

O que o projeto faz

O diferencial não é "gerar uma imagem" — é o ciclo de auto-revisão: o agente gera a arte de fundo, olha o resultado (é multimodal), e se algo saiu errado (texto indevido, composição ruim), corrige o prompt e tenta de novo, até 3 vezes. Depois monta a capa completa (arte + título + autor) e revisa o resultado final antes de aprovar.

Esse comportamento foi testado e confirmado de verdade — inclusive forçando um caso em que a IA precisou corrigir a arte 3 vezes seguidas, respeitando o limite configurado.

Limitações conhecidas
A detecção de texto indevido na arte e a avaliação de composição dependem do julgamento do modelo de IA — não há uma verificação por regras fixas por trás disso. O prompt reforça bastante contra esses erros, e funciona bem na maioria dos casos, mas não é 100% garantido (é uma característica de modelos gratuitos de visão, não uma falha de implementação).
Acompanhar uma geração em andamento só funciona na mesma aba do navegador. Se você fecha a aba, o processo continua no servidor e o resultado aparece no histórico ao terminar, mas o passo a passo em tempo real se perde.
Alguns botões de ação (tentar novamente, gerar variação) ainda não têm proteção contra cliques duplos — diferente do botão principal de gerar capa, que já bloqueia isso.
Decisões conscientes de prazo

A tela de progresso da geração ficou mais técnica (mostra nomes de ferramentas e detalhes do que a IA está fazendo) do que o visual do protótipo original — foi uma escolha pra caber no tempo de entrega, priorizando clareza sobre polimento visual.

O projeto também não foi pensado pra escalar (histórico em arquivo simples, sem banco de dados) — o foco foi cumprir bem o que foi pedido rodando localmente, não construir algo pronto pra múltiplos usuários.

Requisitos do PRD

Todos os requisitos funcionais do documento foram implementados e testados. O único ponto de interpretação: o PRD descreve "layout" e "alinhamento" como dois parâmetros separados, mas o protótipo de referência já mostrava eles combinados em presets fixos — segui o protótipo, que é a fonte visual oficial.