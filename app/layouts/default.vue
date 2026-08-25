<template>
  <div class="pagina">
    <div class="card-central">
      <header class="cabecalho">
        <div class="logo-titulo">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <h1>Gerador de <span class="destaque">Capas</span></h1>
        </div>

        <nav class="abas">
          <NuxtLink to="/" class="link-aba">Nova capa</NuxtLink>
          <NuxtLink to="/?aba=historico" class="link-aba">Histórico</NuxtLink>
        </nav>
      </header>

      <hr class="divisor" />

      <div class="conteudo">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagina { min-height: 100vh; width: 100%; padding: 40px 20px; box-sizing: border-box; }
.card-central { max-width: 900px; margin: 0 auto; background: var(--cor-branco, white); border-radius: var(--raio-card, 10px); box-shadow: var(--sombra-card, 0 1px 4px rgba(0,0,0,0.06)); overflow: hidden; }

.cabecalho { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; }
.logo-titulo { display: flex; align-items: center; gap: 8px; }
.logo-titulo h1 { font-size: 18px; font-weight: 600; margin: 0; }
.destaque { color: var(--cor-primaria, #7c3aed); }

.abas { display: flex; gap: 8px; }
.link-aba {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  color: #666;
  text-decoration: none;
}
.link-aba.router-link-active {
  background: var(--cor-primaria-clara, rgba(124,58,237,0.15));
  color: var(--cor-primaria, #7c3aed);
  font-weight: 600;
}

.divisor { border: none; border-top: 1px solid #e0e0e0; margin: 0; }
.conteudo { padding: 24px; }
</style>