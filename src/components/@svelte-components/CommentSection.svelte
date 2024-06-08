<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  export let slug: string;
  let section: HTMLElement;
  let commentVerify: HTMLElement;
  let form: HTMLFormElement;
  let resp: HTMLElement;

  let loadComment = loadComments();

  async function loadUser() {
    const access = localStorage.getItem("user-access");

    const res = await fetch("/partials/commentVerify", {
      headers: {
        "Authorization": "Bearer " + access
      }
    });

    if (res.ok) {
      return await res.text();
    }
  }

  async function loadComments() {
    const res = await fetch(`/partials/message?slug=${slug}`);

    if (res.ok) {
      return await res.text();
    }
  }

  async function sendComment(e: Event) {
      e.preventDefault();
      const formData = new FormData(form);

      const access = localStorage.getItem("user-access");

      const res = await fetch("/api/comment", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": "Bearer " + access
        }
      });

      if (!res.ok) {
        resp!.innerHTML = "<p class=\"text-red-500\">Something went wrong. Please check your internet connection.</p>";
      } else {
        resp!.innerHTML = "";
        form.reset();
        loadComment = loadComments();
      }
    }
</script>

<form bind:this={form} class="mx-8" on:submit={sendComment}>
  <div bind:this={commentVerify}>
    {#await loadUser()}
      <Icon class="w-16 h-16" icon="svg-spinners:3-dots-fade"/>
    {:then x} 
      {@html x}
    {/await}
  </div>
  <label>
    <textarea class="w-full py-2 px-2 bg-transparent rounded border-2 border-midnight-light" name="comment" rows="2" placeholder="Write a comment here"/>
  </label>

  <input class="hidden" readonly name="slug" value={slug}/>
  <span bind:this={resp}></span>
  <input class="px-4 py-2 my-2 hover:bg-green-400 duration-300 bg-green-600 rounded cursor-pointer" type="submit" value="Send"/>
</form>

<div bind:this={section} class="relative grid gap-4 pb-10 mx-8">
  {#await loadComment}
    <Icon class="w-16 h-16" icon="svg-spinners:tadpole"/>
  {:then x} 
    {@html x}
  {/await}
</div>