<script lang="ts">
  import Icon from "@iconify/svelte";

  async function authVerify() {
    const access = localStorage.getItem("user-access");

    const res = await fetch("/api/authVerify", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + access
      }
    });

    if (res.ok) {
      const text = await res.text();
      return text === "true";
    } else {
      return false;
    }
  }
</script>

{#await authVerify()}
  <Icon class="w-16 h-16" icon="svg-spinners:3-dots-fade"/>
{:then x} 
  {#if x}
    <div class="grid items-center">
      <Icon class="w-8 h-8" icon="ph:user-circle-fill"/>
    </div>
  {:else}
    <a href="/register" class="bg-transparent border-green-700 border-2 hover:border-green-500 rounded-full p-2 m-2 hover:bg-green-500 duration-300 cursor-pointer">
      Register
    </a>
    <a href="/login" class="bg-cyan-700 rounded-full p-2 m-2 hover:bg-cyan-500 duration-300 cursor-pointer">
      Login
    </a>
  {/if}
{/await}
