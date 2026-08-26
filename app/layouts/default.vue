<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const totalHistorico = ref(0);

async function carregarTotal() {
  try {
    const registros = await $fetch("/api/historico");
    totalHistorico.value = registros.length;
  } catch (erro) {
    console.error("Erro ao carregar total do histórico:", erro);
  }
}

onMounted(carregarTotal);
watch(() => route.path, carregarTotal);

</script>

<template>
  <div class="pagina">
    <div class="card-central">
      <header class="cabecalho">
        <div class="logo-titulo">
          <span class="icone-logo">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path
                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
              />
            </svg>
          </span>

          <h1>
            Gerador de <span class="destaque">Capas</span>
          </h1>
        </div>

        <nav class="abas">
          <NuxtLink to="/" class="link-aba">
            Nova capa
          </NuxtLink>

          <NuxtLink to="/historico" class="link-aba">
            Histórico

            <span v-if="totalHistorico > 0" class="badge">
              {{ totalHistorico }}
            </span>
          </NuxtLink>
        </nav>
      </header>

      <hr class="divisor" />

      <div class="conteudo">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagina {
  min-height: 100vh;
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
  background-color: #ede8f2;
}

.card-central {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: var(--cor-branco, white);
  border-radius: var(--raio-card, 10px);
  box-shadow: var(
    --sombra-card,
    0 1px 4px rgba(0, 0, 0, 0.06)
  );
  overflow: hidden;
}

.cabecalho {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
}

.logo-titulo {
  grid-column: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.icone-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  box-shadow: 0 2px 6px rgba(124, 58, 237, 0.2);
}

.logo-titulo h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.15;
  white-space: nowrap;
}

.destaque {
  color: var(--cor-primaria, #7c3aed);
}

.abas {
  grid-column: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  white-space: nowrap;
}

.link-aba {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  color: #666;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.link-aba.router-link-exact-active {
  background: var(
    --cor-primaria-clara,
    rgba(124, 58, 237, 0.15)
  );
  color: var(--cor-primaria, #7c3aed);
  font-weight: 600;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1px 7px;
  font-size: 12px;
  font-weight: 600;
}

.link-aba.router-link-exact-active .badge {
  background: var(--cor-primaria, #7c3aed);
  color: white;
}

.divisor {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0;
}

.conteudo {
  padding: 24px;
  min-width: 0;
}

@media (max-width: 600px) {
  .pagina {
    padding: 16px 10px;
  }

  .cabecalho {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    padding: 16px;
  }

  .logo-titulo {
    grid-column: 1;
    gap: 8px;
    min-width: 0;
  }

  .icone-logo {
    width: 36px;
    height: 36px;
  }

  .logo-titulo h1 {
    font-size: 17px;
    white-space: normal;
    max-width: 90px;
  }

  .destaque {
    display: block;
  }

  .abas {
    grid-column: 2;
    justify-self: end;
    gap: 4px;
  }

  .link-aba {
    padding: 7px 10px;
    font-size: 13px;
  }

  .conteudo {
    padding: 16px;
  }
}

@media (max-width: 400px) {
  .cabecalho {
    gap: 8px;
    padding: 14px 12px;
  }

  .logo-titulo {
    gap: 7px;
  }

  .icone-logo {
    width: 34px;
    height: 34px;
  }

  .logo-titulo h1 {
    font-size: 16px;
    max-width: 85px;
  }

  .abas {
    gap: 3px;
  }

  .link-aba {
    padding: 6px 7px;
    font-size: 12px;
  }

  .badge {
    min-width: 16px;
    padding: 1px 5px;
    font-size: 11px;
  }
}
</style>