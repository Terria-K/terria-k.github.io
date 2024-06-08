<script lang="ts">
  import Icon from "@iconify/svelte";

  let loading = false;
  let form: HTMLFormElement;
  let resultText: string = "";
  let color: string | undefined = undefined;

  async function register(e: Event) {
    e.preventDefault();
    loading = true;
    const formData = new FormData(form);

    const resp = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    if (!resp.ok) {
      const error = await resp.json();
      if (error) {
        resultText = error.message;
      } else {
        resultText = "Something is incorrect";
      }
      color = "text-red-500";
    } else {
      resultText = "Registered successfully! Please check your inbox (or spam) in your email to verify your account."
      color = "text-green-500";
      form.reset();
    }
    loading = false;
  }
</script>

<form bind:this={form} on:submit={register} class="grid gap-4">
  <label>
    <p class="email">Username: <span class="text-red-400">*</span></p>
    <input name="username" type="text"/>

    <p class="email">Email: <span class="text-red-400">*</span></p>
    <input name="email" type="text"/>

    <p class="email">Password: <span class="text-red-400">*</span></p>
    <input name="password" type="password"/>

    <p class="email">Confirm Password: <span class="text-red-400">*</span></p>
    <input name="confirmation" type="password"/>
  </label>

  <p>Have an account already? <a class="text-cyan-500 underline" href="/login">Click here to login</a></p>

  <div>
    <button
      disabled={loading}
      class="hover:bg-green-400 bg-green-600 duration-300 
      text-white px-8 py-4 text-xl rounded-xl cursor-pointer disabled:bg-green-950 disabled:cursor-not-allowed w-[137px]">
      <p class="flex justify-center" id="replacement">
        {#if loading}
          <Icon class="w-8 h-8" icon="svg-spinners:3-dots-fade"/>
        {:else}
          Register
        {/if}
      </p>
    </button>
  </div>

  <p class={color} id="result">{@html resultText}</p>

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