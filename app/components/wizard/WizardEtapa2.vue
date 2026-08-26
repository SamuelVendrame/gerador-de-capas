<script setup lang="ts">
import { GENEROS } from "~~/shared/schemasGeneros";
import { Heart, Terminal, Smile, TrendingUp, Star } from "lucide-vue-next";

const genero = defineModel<string>("genero", { required: true });

const ICONES_COMPONENTE: Record<string, any> = {
  Romance: Heart,
  Técnico: Terminal,
  Infantil: Smile,
  Negocios: TrendingUp,
  Fantasia: Star,
};
</script>

<template>
  <div class="etapa">
    <div class="container-inputs">
      <div class="opcoes-genero">
        <label
          v-for="g in GENEROS"
          :key="g.valor"
          class="opcao"
          :class="{ selecionado: genero === g.valor }"
        >
          <input
            type="radio"
            :value="g.valor"
            v-model="genero"
            class="input-oculto"
          />

          <component
            :is="ICONES_COMPONENTE[g.valor]"
            :size="18"
            class="icone-genero"
          />

          <div class="texto-opcao">
            <span class="opcao-label">{{ g.label }}</span>
            <span class="opcao-descricao">{{ g.descricao }}</span>
          </div>

          <span class="bolinha"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.etapa {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: rgb(241, 241, 241);
}

.container-inputs {
  padding: 24px;
  background-color: white;
}

.opcoes-genero {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.opcao {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
  flex: 1 1 calc(33.333% - 8px);
  min-width: 150px;
}

.opcao.selecionado {
  border-color: var(--cor-primaria, #7c3aed);
}

.input-oculto {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.icone-genero {
  color: var(--cor-primaria, #7c3aed);
  flex-shrink: 0;
}

.texto-opcao {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.opcao-label {
  font-weight: 600;
  font-size: 14px;
}

.opcao-descricao {
  color: #888;
  font-size: 12px;
}

.bolinha {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ddd;
  flex-shrink: 0;
  position: relative;
}

.opcao.selecionado .bolinha {
  border-color: var(--cor-primaria, #7c3aed);
}

.opcao.selecionado .bolinha::after {
  content: "";
  position: absolute;
  inset: 2px;
  border-radius: 50%;
  background: var(--cor-primaria, #7c3aed);
}

@media (max-width: 600px) {
  .container-inputs {
    padding: 16px;
  }

  .opcao {
    flex: 1 1 100%;
    min-width: 0;
  }
}
</style>