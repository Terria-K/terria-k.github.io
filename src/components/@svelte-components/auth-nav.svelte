<svelte:options customElement="auth-nav"/>
<script lang="ts">
  import Icon from "@iconify/svelte";

  let open = false;
  let cached: string | undefined = undefined;

  async function authVerify() {
    if (cached) {
      return cached;
    }
    const access = localStorage.getItem("user-access");

    const res = await fetch("/partials/authVerify", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + access
      }
    });

    if (res.ok) {
      const text = await res.text();
      return cached = text;
    }

    return "Unknown Error";
  }
</script>

<button class="btn" on:click={() => open = !open} data-open={!open ? undefined : ""}>
  <Icon icon="ph:caret-down-fill"/>
</button>
{#if open}
  <div class="dialog">
    {#await authVerify()}
      <span class="icon">
        <Icon icon="svg-spinners:3-dots-fade"/>
      </span>
    {:then html}
      {@html html}
    {/await}
  </div>
{/if}


<style>
  .btn {
    height: 100%;
    transition: 300ms;
    border: none;
    background-color: transparent;
    cursor: pointer;
    text-align: center;
  }

  .icon {
    width: 2rem;
    height: 2rem;
  }

  .dialog {
    position: absolute;
    background-color: var(--col-midnight);
    border-radius: 0.25rem;
    transform: translateX(-80px);
  }

  :global(.user) {
    display: grid;
    align-items: center;
  }

  :global(.unregistered) {
    display: grid;
    text-align: center;
  }

  :global(.register-btn) {
    color: white;
    text-decoration: none;
    border-radius: 0.25rem;
    transition: 300ms;
    cursor: pointer;
    padding: 0.5rem 1rem 0.5rem 1rem;
  }

  :global(.register-btn:hover) {
    background-color: rgb(34, 197, 94);
  }

  :global(.login-btn) {
    color: white;
    text-decoration: none;
    border-radius: 0.25rem;
    transition: 300ms;
    cursor: pointer;
    padding: 0.5rem 1rem 0.5rem 1rem;
  }

  :global(.login-btn:hover) {
    background-color: rgb(6, 182, 212);
  }

  .btn[data-open] {
    transform: rotate(180deg);
  }
</style>
