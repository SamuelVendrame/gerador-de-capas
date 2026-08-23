<script setup lang="ts">
    const route = useRoute();

    const layout = route.query.layout as any;
    const fonte = route.query.fonte as any;
    const imagemUrl = route.query.imagemUrl as string;
    const titulo = route.query.titulo as string;
    const autor = route.query.autor as string;

    definePageMeta({ layout: false });
</script>

<template>
  <CapaLivro
    :layout="layout"
    :fonte="fonte"
    :imagem-url="imagemUrl"
    :titulo="titulo"
    :autor="autor"
  />
</template>