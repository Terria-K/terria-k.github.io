<svelte:options customElement="comment-body" />
<script lang="ts">
    import Icon from "@iconify/svelte";

    export let username: string;
    export let sessionname: string;
    export let date: string;
    export let body: string;
    export let id: string;

    async function remove() {
      const access = localStorage.getItem("user-access");

      const body = {
        username,
        id
      }
      const res = await fetch("/api/comment", {
        body: JSON.stringify(body),
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + access
        }
      });

      if (res.ok) {
        window.location.reload();
      }
    }
</script>

<div class="mx-2 p-4 bg-midnight rounded-xl flex gap-5 justify-between">
  <div>
    <h1 class={`font-bold text-lg ${username === "Guest" ? "text-gray-400" : ""}`}>{username}</h1>
    <span class="text-gray-500 text-sm">
      <span>
        {
          date
        }
      </span>
    </span>
    <p>{body}</p>
  </div>

  {#if sessionname !== "Guest" && sessionname === username}
    <button on:click={remove} class="delete" data-id={id}>
      <span class="cursor-pointer text-red-500 w-6 h-6">
        <Icon icon="ph:trash"/>
      </span>
    </button>
  {/if}
</div>


<style>
    @tailwind base;
    @tailwind utilities;
    @tailwind components;
</style>