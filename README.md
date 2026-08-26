# Gerador de Capas de Livros com IA

Ferramenta local, com interface web, em que um agente de IA multimodal gera capas de livros de forma iterativa: cria a arte de fundo, monta a capa sobre layouts prontos e revisa o próprio resultado até ficar bom.

Stack: Nuxt/Vue 3/TypeScript no front, Node.js no back, OpenRouter para o modelo de IA e WaveSpeed para geração de imagem.

## Como rodar

npm install 

npx playwright install chromium 

npm run dev

Cria um .env na raiz com as keys

Acessa em 'http://localhost:3000'.

## O que o projeto faz

O diferencial não é "gerar uma imagem", mas sim o ciclo de auto-revisão: o agente gera a arte de fundo, olha o resultado (é multimodal), e se algo saiu errado (texto indevido, composição ruim), corrige o prompt e tenta de novo, até 3 vezes. Depois monta a capa completa (arte + título + autor) e revisa o resultado final antes de aprovar.

## Limitações conhecidas

- A detecção de texto indevido na arte e a avaliação de composição dependem do julgamento do modelo de IA. Não há uma verificação por regras fixas por trás disso. O prompt reforça bastante contra esses erros, e funciona bem na maioria dos casos, mas não é 100% garantido (é uma característica de modelos gratuitos de visão, não uma falha de implementação).
- IMPORTANTE: Não tente dar retry numa capa que foi cancelada enquanto há outra sendo gerada. Você será redirecionado para o carregamento da capa gerada atualmente (isso foi um tradeoff que eu optei por manter para conseguir entregar o projeto dentro dos dias que propus, mas é algo simples de resolver) - fiz isso pensando no sistema para gerar uma capa por vez.
- Acompanhar uma geração em andamento só funciona na mesma aba do navegador. Se você fecha a aba, o processo continua no servidor e o resultado aparece no histórico ao terminar, mas o passo a passo em tempo real se perde.
- Alguns botões de ação (tentar novamente, gerar variação) ainda não têm proteção contra cliques duplos, diferente do botão principal de gerar capa, que já bloqueia isso se há uma geração sendo feita.

## Decisões 

A tela de progresso da geração ficou mais técnica (mostra nomes de ferramentas e detalhes do que a IA está fazendo) do que o visual do protótipo original, foi uma escolha pra caber no tempo de entrega, priorizando clareza sobre polimento visual.

Sobre a persistência de dados: o histórico é armazenado em um arquivo JSON simples, não em um banco de dados. Interpretei "execução local" do PRD como não precisar de infraestrutura externa, e um arquivo resolve bem o volume de dados de uma aplicação desse tamanho, acredito eu. Mas obviamente a evolução natural disso seria ir para um SQLite local ou hospedado.

O projeto também não foi pensado pra escalar (histórico em arquivo simples, sem banco de dados), o foco foi cumprir bem o que foi pedido rodando localmente, não construir algo pronto pra múltiplos usuários. Talvez isso dê uma visão de código meio bagunçado (ao menos foi o que eu senti), mas é porque não tenho muita experiência com salvar itens armazenados em array/na memória, e consequentemente isso pode ter gerado um código meio estranho pra avaliar.

O sistema também tem um teto geral de 12 iterações no loop do agente, separado do limite de 3 tentativas por etapa. Ele existe como proteção extra: garante que o processo sempre termina mesmo em algum cenário que os limites de 3 não cubram sozinhos (por exemplo, o modelo ficando preso só analisando em texto, sem chamar nenhuma ferramenta). Na prática, ele quase nunca é atingido, o fluxo normal sempre bate nos limites de 3 bem antes disso.

## Requisitos do PRD

Todos os requisitos funcionais do documento foram implementados e testados. O único ponto de interpretação: o PRD descreve "layout" e "alinhamento" como dois parâmetros separados, mas o protótipo de referência já mostrava eles combinados em presets fixos, e eu segui o protótipo, que é a fonte visual oficial.

## Considerações

Bom, esse foi meu primeiro projeto realmente feito e terminado em Vue/Nuxt, então pode ser que hajam algumas misturas de responsabilidades ou um código meio ruim, mas acredito que tenha me dado uma boa experiência com a linguagem. Me diverti bastante fazendo o processo do toolcalling e no uso da IA pra manusear as imagens, foi bacana.
