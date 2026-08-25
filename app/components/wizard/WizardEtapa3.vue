<script setup lang="ts">
    const descricao = defineModel<string>("descricao", { required: true });
</script>

<template>
  <div class="etapa">
    <div class="campo">
      <label for="descricao">Descrição breve</label>
      <textarea id="descricao" v-model="descricao" rows="4" />
      <span class="dica">Duas ou três frases bastam — é daqui que sai o prompt da arte.</span>
    </div>
  </div>
</template>

<style scoped>
.etapa { display: flex; flex-direction: column; gap: 16px; }
.subtitulo { color: #666; font-size: 14px; margin: -8px 0 8px; }
.campo { display: flex; flex-direction: column; gap: 4px; }
label { font-weight: 600; }
textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; resize: vertical; }
.dica { color: #999; font-size: 13px; }
</style>