<script setup lang="ts">
import { GENEROS } from "~~/shared/schemasGeneros";

const genero = defineModel<string>("genero", { required: true });

</script>

<template>
  <div class="etapa">
    <h2>Que tipo de livro é?</h2>
    <p class="subtitulo">Isso guia paleta, composição e tipografia que o agente vai escolher.</p>

    <div class="opcoes-genero">
      <label
        v-for="g in GENEROS"
        :key="g.valor"
        class="opcao"
        :class="{ selecionado: genero === g.valor }"
      >
        <input type="radio" :value="g.valor" v-model="genero" />
        <span class="opcao-label">{{ g.label }}</span>
        <span class="opcao-descricao">{{ g.descricao }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.etapa { display: flex; flex-direction: column; gap: 16px; }
.subtitulo { color: #666; font-size: 14px; margin: -8px 0 8px; }
.opcoes-genero { display: flex; flex-direction: column; gap: 8px; }
.opcao {
  display: flex;
  flex-direction: column;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
}
.opcao.selecionado { border-color: #7c3aed; background: #f5f0ff; }
.opcao-label { font-weight: 600; }
.opcao-descricao { color: #666; font-size: 13px; }
</style>