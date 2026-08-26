<script setup lang="ts">
const clima = defineModel<string>("clima");

defineProps<{ gerando: boolean }>();
const emit = defineEmits<{ gerar: [] }>();
</script>

<template>
  <div class="etapa">
    <div class="campo">
      <label for="clima" class="campo-ajuda">Preferências de clima (opcional)</label>

      <textarea
        id="clima"
        v-model="clima"
        rows="3"
        placeholder="Tons escuros, clima de mistério, sem rostos"
      ></textarea>

      <span class="campo-ajuda">
        Descreva o estilo visual que você imagina para a capa.
      </span>
    </div>

    <div class="agente-decide">
      <h3>O agente decide agora</h3>

      <ul>
        <li>
          <span class="item-icone">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 5h16" />
              <path d="M10 5v14" />
              <path d="M14 5v14" />
              <path d="M7 19h10" />
            </svg>
          </span>

          <span>
            A tipografia do título, pelo gênero e pelo tamanho do nome do livro.
          </span>
        </li>

        <li>
          <span class="item-icone">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 9v12" />
            </svg>
          </span>

          <span>
            O layout: título centralizado ou título no topo com autor na base.
          </span>
        </li>

        <li>
          <span class="item-icone">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h2a7 7 0 0 0 0-10h-2Z"
              />
              <circle cx="7.5" cy="10" r="1" />
              <circle cx="9" cy="6.5" r="1" />
              <circle cx="14" cy="6.5" r="1" />
            </svg>
          </span>

          <span>
            A paleta e a arte de fundo — com até 3 tentativas e autorrevisão.
          </span>
        </li>
      </ul>

      <p class="nota">
        Depois da geração você pode trocar tipografia e layout com um clique e
        ver como fica.
      </p>
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
  font-weight: 600;
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
  min-height: 80px;
  outline: none;
}

textarea::placeholder {
  color: #999;
  opacity: 1;
}

textarea:focus {
  border-color: #b8a0df;
}

.campo-ajuda {
  color: #999;
  font-size: 13px;
  line-height: 1.4;
}

.agente-decide {
  width: 100%;
  box-sizing: border-box;
  background: #f5f0ff;
  border: 1px solid #e7ddf7;
  padding: 16px;
  border-radius: 8px;
}

.agente-decide h3 {
  margin: 0 0 10px;
  font-size: 15px;
  color: #7c3aed;
}

.agente-decide ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
  color: #444;
}

.agente-decide li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  line-height: 1.45;
  min-width: 0;
}

.item-icone {
  flex: 0 0 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7c3aed;
  margin-top: 1px;
}

.nota {
  color: #999;
  font-size: 13px;
  line-height: 1.4;
  margin: 12px 0 0;
}
</style>