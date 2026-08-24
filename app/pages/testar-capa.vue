<script setup lang="ts">
// pagina temporaria p testes

const layouts = ["centralizado", "topoBase", "rodape", "faixa", "direita"] as const;

// imagem placeholder so para testes, trocar pela real do wavespeed quando quiser testar com a arte
const imagemTeste = "https://picsum.photos/seed/capa/1200/1800";
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 24px; padding: 24px; background: #222;">
    <div v-for="layout in layouts" :key="layout" style="transform: scale(0.3); transform-origin: top left; margin-bottom: -1250px;">
      <p style="color: white; font-family: sans-serif; margin-bottom: 8px;">{{ layout }}</p>
      <CapaLivro
        :layout="layout"
        fonte="Space Grotesk"
        :imagem-url="imagemTeste"
        titulo="A Longa Jornada Através das Montanhas Esquecidas do Norte"
        autor="Helena Vasques"
      />
    </div>
  </div>
</template>