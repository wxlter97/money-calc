<script>
  import Nav from './components/Nav.svelte';
  import Hub from './components/Hub.svelte';
  import { calculadoras } from './registry.js';

  function slugActual() {
    return window.location.hash.replace(/^#\/?/, '');
  }

  let slug = $state(slugActual());

  $effect(() => {
    const alCambiar = () => (slug = slugActual());
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  });

  let activa = $derived(calculadoras.find((c) => c.slug === slug) ?? null);
  let ComponenteActivo = $derived(activa?.componente ?? null);
</script>

<Nav titulo={activa?.titulo ?? null} />

<main class="app-main">
  {#if ComponenteActivo}
    <ComponenteActivo />
  {:else}
    <Hub {calculadoras} />
  {/if}
</main>
