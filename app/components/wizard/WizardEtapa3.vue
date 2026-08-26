<script setup lang="ts">
const descricao = defineModel<string>("descricao", { required: true });
</script>

<template>
  <div class="etapa">
    <div class="campo">
      <label for="descricao" class="dica">Descrição breve</label>

      <textarea
        id="descricao"
        v-model="descricao"
        rows="4"
        placeholder="Ex.: Uma cidade isolada onde desaparecimentos misteriosos acontecem durante a noite."
      ></textarea>

      <span class="dica">
        Duas ou três frases bastam — é daqui que sai o prompt da arte.
      </span>
    </div>
  </div>
</template>

<style scoped>
.etapa {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  min-width: 0;
}

label {
  font-weight: 400;
}

textarea {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
  line-height: 1.4;
  resize: vertical;
  min-height: 100px;
  outline: none;
}

textarea::placeholder {
  color: #999;
  opacity: 1;
}

textarea:focus {
  border-color: #b8a0df;
}

.dica {
  color: #999;
  font-size: 13px;
  line-height: 1.4;
}
</style>