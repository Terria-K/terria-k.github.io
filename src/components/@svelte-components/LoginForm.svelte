<script lang="ts">
  import Icon from "@iconify/svelte";

  let loading = false;
  let form: HTMLFormElement;
  let errorText: string = "";

  async function login(e: Event) {
    e.preventDefault();
    loading = true;
    const formData = new FormData(form);

    const resp = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });

    if (!resp.ok) {
      if (resp.status === 401) {
        const error = await resp.text();
        errorText = error;
      } else {
        errorText = "Email, Username or Password are invalid.";
      }
    } else {
      const token = (await resp.json()).token;
      localStorage.setItem("user-access", token);
      window.location.href = "/";
    }

    loading = false;
  }

</script>

<form bind:this={form} on:submit={login} class="grid gap-4">
  <label>
    <p class="email">Email: <span class="text-red-400">*</span></p>
    <input name="email" type="text"/>

    <p class="email">Password: <span class="text-red-400">*</span></p>
    <input name="password" type="password"/>
  </label>

  <p>Don't have an account yet?  
    <a href="/register" class="text-cyan-500 underline">Create on here</a>
  </p>

  <div>
    <button
      disabled={loading}
      class="hover:bg-green-400 bg-green-600 duration-300 
      text-white px-8 py-4 text-xl rounded-xl cursor-pointer disabled:bg-green-950 disabled:cursor-not-allowed w-[137px]">
      <p class="flex justify-center">
        {#if loading}
          <Icon class="w-8 h-8" icon="svg-spinners:3-dots-fade"/>
        {:else}
          Login
        {/if}
      </p>
    </button>
  </div>
  <p class="text-red-500">{@html errorText}</p>
</form>

<style>
  label {
    display: flex;
    flex-direction: column;
    color: white;
  }

  input[type=text], input[type=password] {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background-color: transparent;
    border-radius: 0.25rem;
    border-width: 2px;
    border-color: var(--col-midnight-light);
  }
</style>