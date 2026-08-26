<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
:root {
  --cor-primaria: #7c3aed;
  --cor-primaria-clara: rgba(124, 58, 237, 0.15);
  --cor-texto: #333;
  --cor-texto-secundario: #666;
  --cor-texto-suave: #999;
  --cor-borda: #ddd;
  --cor-fundo-pagina: #fafafa;
  --cor-branco: #ffffff;
  --cor-sucesso-fundo: #e8f5e9;
  --cor-sucesso-texto: #2e7d32;
  --cor-erro-fundo: #ffebee;
  --cor-erro-texto: #c62828;
  --cor-erro-fundo-suave: rgba(198, 40, 40, 0.08);

  --raio-card: 10px;
  --raio-botao: 6px;
  --raio-pill: 999px;
  --sombra-card: 0 1px 4px rgba(0, 0, 0, 0.06);
  --sombra-hover: 0 6px 16px rgba(0, 0, 0, 0.1);

  --fonte-base: "Tilt Neon", sans-serif;
}

* {
  font-family: var(--fonte-base);
}

body {
  background: var(--cor-fundo-pagina);
  margin: 0;
}
</style>