<script setup lang="ts">
</script>

<template>
  <WizardNovaCapa />
</template>
<style scoped>

* {
  font-family: "Tilt Neon", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box
}

html,
body {
  margin: 0;
  padding: 0;
}

.cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: white;
}

.logo-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-titulo h1 {
  font-size: 18px;
  font-weight: 400;
  margin: 0;
}
.destaque { color: #7c3aed; }

.abas {
  display: flex;
  gap: 8px;
}
.abas button {
  padding: 8px 14px;
  background: #f0f0f0;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
  font-weight: 500;
}

.abas button.ativa {
  background: rgba(124, 58, 237, 0.20);
  border-color: transparent;
  color: #7c3aed;
}

.badge {
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1px 7px;
  font-size: 12px;
  font-weight: 600;
}

.abas button.ativa .badge {
  background: #7c3aed; 
  color: white;
}

.divisor {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0;
}

.conteudo {
  padding: 24px;
  background-color: #f7f7f7;
}
</style>