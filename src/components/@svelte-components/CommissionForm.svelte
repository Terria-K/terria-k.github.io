<script lang="ts">
  import Icon from "@iconify/svelte";

  let form: HTMLFormElement;

  let resultHtml = "";

  async function disabledCheck() {
    const res = await fetch("/partials/open");
    if (res.ok) {
      return await res.text();
    }
  }

  async function submitRequest(e: Event) {
    e.preventDefault();

    const formData = new FormData(form);

    const res = await fetch("/api/request", {
      method: "POST",
      body: formData
    });

    resultHtml = await res.text();

    if (res.ok) {
      form.reset();
    }
  }
</script>

<form bind:this={form} class="grid gap-4" on:submit={submitRequest}>
  <slot/>

  <div>
    {#await disabledCheck()}
      <Icon class="w-16 h-16" icon="svg-spinners:tadpole"/>
    {:then x} 
     {@html x}
    {/await}
  </div>
  <p id="result">
    {@html resultHtml}
  </p>
</form>