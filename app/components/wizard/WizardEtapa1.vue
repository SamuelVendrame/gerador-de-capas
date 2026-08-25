<script setup lang="ts">
const titulo = defineModel<string>("titulo", { required: true });
const autor = defineModel<string>("autor", { required: true });
</script>

<template>
  <div class="etapa">
    <div class="container-inputs">
      <div class="linha-campos">
        <div class="campo">
          <label for="titulo">Título do livro</label>
          <input id="titulo" v-model="titulo" type="text" placeholder="O Silêncio Entre as Marés" />
        </div>

        <div class="campo">
          <label for="autor">Autor</label>
          <input id="autor" v-model="autor" type="text" placeholder="Helena Vasques" />
        </div>
      </div>

      <p class="nota">Sem login. Nada é publicado sem você.</p>
    </div>
  </div>
</template>

<style scoped>
.etapa { display: flex; flex-direction: column; gap: 16px; background-color: rgb(241, 241, 241); }
.subtitulo { color: #666; font-size: 14px; margin: -8px 0 8px; }
.container-inputs { padding: 24px; background-color: white; }

.linha-campos {
  display: flex;
  gap: 20px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

label {
  font-weight: 600;
  color: #888;
  font-size: 14px;
}

input {
  padding: 12px 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.2s;
}
input:focus {
  outline: none;
  border-color: var(--cor-primaria, #7c3aed);
}
input::placeholder {
  color: #bbb;
}

.nota { color: #999; font-size: 13px; margin-top: 16px; }
</style>