<script setup lang="ts">
    const titulo = defineModel<string>("titulo", { required: true });
    const autor = defineModel<string>("autor", { required: true });
</script>

<template>
  <div class="etapa">
    <h2>Qual é o livro?</h2>
    <p class="subtitulo">Só o essencial. O agente cuida do resto — layout, tipografia, arte e revisão.</p>

    <div class="campo">
      <label for="titulo">Título do livro</label>
      <input id="titulo" v-model="titulo" type="text" />
    </div>

    <div class="campo">
      <label for="autor">Autor</label>
      <input id="autor" v-model="autor" type="text" />
    </div>

    <p class="nota">Sem login. Nada é publicado sem você.</p>
  </div>
</template>

<style scoped>
    .etapa { display: flex; flex-direction: column; gap: 16px; }
    .subtitulo { color: #666; font-size: 14px; margin: -8px 0 8px; }
    .campo { display: flex; flex-direction: column; gap: 4px; }
    label { font-weight: 600; }
    input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; }
    .nota { color: #999; font-size: 13px; margin-top: 8px; }
</style>