
<script setup lang="ts">
  import { computed } from 'vue';

  type Layout = "centralizado" | "topoBase" | "rodape" | "faixa" | "direita";
  type Fonte = "Playfair Display" | "Cormorant Garamond" | "Bebas Neue" | "Space Grotesk" | "Baloo 2";

  const props = defineProps<{
    layout: Layout;
    fonte: Fonte;
    imagemUrl: string;
    titulo: string;
    autor: string;
  }>();

  const tamanhoFonte = computed(() => {
    const tamanho = props.titulo.length;
    if (tamanho <= 20) return "100px";
    if (tamanho <= 40) return "80px";
    return "64px";
  });

</script>

<template>
  <div
    class="capa"
    :style="{
      backgroundImage: `url(${props.imagemUrl})`,
      fontFamily: props.fonte,
    }"
  >
    <div v-if="layout === 'centralizado'" class="conteudo centralizado">
      <h1 class="titulo" :style="{ fontSize: tamanhoFonte }">{{ titulo }}</h1>
      <div class="linha" />
      <p class="autor">{{ autor.toUpperCase() }}</p>
    </div>

    <div v-else-if="layout === 'topoBase'" class="conteudo topoBase">
      <div class="bloco-topo">
        <h1 class="titulo" :style="{ fontSize: tamanhoFonte }">{{ titulo }}</h1>
        <div class="linha linha-curta" />
      </div>
        <p class="autor">{{ autor.toUpperCase() }}</p>
    </div>

    <div v-else-if="layout === 'rodape'" class="conteudo rodape">
      <h1 class="titulo" :style="{ fontSize: tamanhoFonte }">{{ titulo }}</h1>
      <div class="linha" />
      <p class="autor">{{ autor.toUpperCase() }}</p>
    </div>

    <div v-else-if="layout === 'faixa'" class="conteudo faixa">
      <div class="faixa-fundo">
        <h1 class="titulo" :style="{ fontSize: tamanhoFonte }">{{ titulo }}</h1>
      </div>
        <p class="autor">{{ autor.toUpperCase() }}</p>
    </div>

    <div v-else-if="layout === 'direita'" class="conteudo direita">
      <h1 class="titulo" :style="{ fontSize: tamanhoFonte }">{{ titulo }}</h1>
      <div class="linha" />
      <p class="autor">{{ autor.toUpperCase() }}</p>
    </div>
  </div>
</template>

<style scoped>
  .capa {
    width: 1200px;
    height: 1800px;
    background-size: cover;
    background-position: center;
    position: relative;
    color: #fff;
    display: flex;
    box-sizing: border-box;
  }

  .titulo {
    font-size: clamp(40px, 10vw, 80px);
    font-weight: 700;
    line-height: 1.15;
    margin: 0;
    overflow-wrap: break-word;
  }

  .autor {
    font-size: 36px;
    font-weight: 600;
    letter-spacing: 0.15em;
    margin: 0;
  }

  .linha {
    width: 120px;
    height: 2px;
    background: rgba(255, 255, 255, 0.6);
    margin: 24px 0;
  }

  .centralizado {
    margin: auto;
    text-align: center;
    padding: 0 80px;
  }
  .centralizado .linha { margin: 24px auto; }

  .topoBase {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 80px;
    box-sizing: border-box;
  }

  .linha-curta { width: 80px; margin: 16px 0 0 0; }

  .rodape {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 80px;
    box-sizing: border-box;
  }

  .faixa {
    width: 100%;
    margin: auto 0;        /* centraliza o bloco inteiro verticalmente, sem esticar */
    display: flex;
    flex-direction: column;
    align-items: center;   /* centraliza faixa-fundo e autor horizontalmente */
  }

  .faixa-fundo {
    width: 100%;
    background: rgba(0, 0, 0, 0.45);
    padding: 48px 80px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }

  .faixa .autor {
    margin-top: 16px;
    text-align: center;
  }

  .direita {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    text-align: right;
    padding: 80px;
    box-sizing: border-box;
  }

  .direita .linha { margin-left: auto; }
</style>