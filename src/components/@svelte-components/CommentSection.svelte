<script lang="ts">
  import Icon from "@iconify/svelte";
  import Comment from "./Comment.svelte";

  export let slug: string;
  let section: HTMLElement;
  let commentVerify: HTMLElement;
  let form: HTMLFormElement;
  let resp: HTMLElement;

  type CommentType = {
    sessionName: string,
    messages: {
      count: number;
        comment: {
          _id: string;
          author: string;
          artRef: string;
          date: Date;
          body: string;
        };
      username: string;
    }[]
  }

  let page = 0;
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

  async function loadComments(): Promise<CommentType> {
    const access = localStorage.getItem("user-access");
    const res = await fetch(`/api/comment?slug=${slug}&page=${page}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + access
      }
    });

    if (res.ok) {
      return await res.json();
    }
    return { sessionName: "unknown", messages: [] };
  }

  async function sendComment(e: Event) {
    e.preventDefault();
    const formData = new FormData(form);
    formData.set("slug", slug);

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

  function nextPage(index: number) {
    page = index;
    loadComment = loadComments();
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

  <span bind:this={resp}></span>
  <input class="px-4 py-2 my-2 hover:bg-green-400 duration-300 bg-green-600 rounded cursor-pointer" type="submit" value="Send"/>
</form>

<div bind:this={section} class="relative grid gap-4 pb-10 mx-8">
  {#await loadComment}
    <Icon class="w-16 h-16" icon="svg-spinners:tadpole"/>
  {:then data} 
    <p>Comments: ({data.messages[0]?.count ?? 0})</p>
    {#each data.messages as message}
      <Comment 
        username={message.username} 
        sessionname={data.sessionName} 
        date={new Date(message.comment.date).toLocaleDateString("en-us", {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
        }).replace(",", "")}
        id={message.comment._id}
        body={message.comment.body}/>
    {/each}
    <div class="mx-8 flex justify-center pt-10 gap-4">
      {#each { length: Math.ceil(data.messages[0]?.count / 5 ?? 0) } as _, index}
        <button on:click={() => nextPage(index)} disabled={index === page} class="
          disabled:border-cyan-500
            p-4 border-2 hover:border-cyan-500 duration-300 border-midnight-light rounded-xl">
          {index + 1}
        </button>
      {/each}
    </div>
  {/await}
</div>