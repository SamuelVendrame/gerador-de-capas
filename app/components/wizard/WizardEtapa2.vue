<script setup lang="ts">
import { GENEROS } from "~~/shared/schemasGeneros";

const genero = defineModel<string>("genero", { required: true });

const ICONES: Record<string, string> = {
  romance: "M12 21c-1-4-4-6-8-8 2-4 6-4 8-1 2-3 6-3 8 1-4 2-7 4-8 8Z",
  tecnico: "M14 2 6 12h5l-1 8 9-11h-5l1-7Z",
  infantil: "M12 2 2 8l10 6 10-6-10-6ZM2 16l10 6 10-6",
  fantasia: "M12 2 15 9 22 9 16.5 13.5 18.5 21 12 17 5.5 21 7.5 13.5 2 9 9 9Z",
  negocios: "M3 21V9l9-6 9 6v12H3ZM9 21v-6h6v6",
};
</script>

<template>
  <div class="opcoes-genero">
    <label
      v-for="g in GENEROS"
      :key="g.valor"
      class="opcao"
      :class="{ selecionado: genero === g.valor }"
    >
      <input type="radio" :value="g.valor" v-model="genero" class="input-oculto" />

      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" class="icone-genero">
        <path :d="ICONES[g.valor]" />
      </svg>

      <div class="texto-opcao">
        <span class="opcao-label">{{ g.label }}</span>
        <span class="opcao-descricao">{{ g.descricao }}</span>
      </div>

      <span class="bolinha" />
    </label>
  </div>
</template>

<style scoped>
.opcoes-genero { display: flex; flex-direction: column; gap: 10px; }

.opcao {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--cor-borda);
  border-radius: var(--raio-botao);
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}
.opcao.selecionado {
  border-color: var(--cor-primaria);
}

.input-oculto {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.icone-genero { color: var(--cor-primaria); flex-shrink: 0; }

.texto-opcao {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.opcao-label { font-weight: 600; }
.opcao-descricao { color: var(--cor-texto-secundario); font-size: 13px; }

.bolinha {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--cor-borda);
  flex-shrink: 0;
  position: relative;
}
.opcao.selecionado .bolinha {
  border-color: var(--cor-primaria);
}
.opcao.selecionado .bolinha::after {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: var(--cor-primaria);
}
</style>