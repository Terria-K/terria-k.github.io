<svelte:options customElement="site-canvas"/>
<script lang="ts">
  import html from "rasterizehtml";
  import { onMount } from "svelte";
  let canvas: HTMLCanvasElement;

  export let url: string;

  onMount(() => {
    html.drawURL(url, canvas);
  })
</script>

<canvas width="1245" height="786" bind:this={canvas}></canvas>

<style>
  canvas {
    object-fit: cover;
    width: 622.5px;
    height: 393px;
  }
</style>
