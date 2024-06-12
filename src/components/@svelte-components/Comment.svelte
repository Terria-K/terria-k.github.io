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

<div class="box">
  <div>
    <h1 class={`user ${username === "Guest" ? "guest" : ""}`}>{username}</h1>
    <span class="time">
      <span>
        {
          date
        }
      </span>
    </span>
    <p class="body">{body}</p>
  </div>

  {#if sessionname !== "Guest" && sessionname === username}
    <button on:click={remove} class="trash delete" data-id={id}>
      <span>
        <Icon style="width:24px;height:24px;" icon="ph:trash"/>
      </span>
    </button>
  {/if}
</div>


<style lang="postcss">
  .box {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    background-color: #1f222b;
    padding: 1rem;
    border-radius: 0.75rem;
    display: flex;
    gap: 1.0rem;
    justify-content: space-between;
  }

  .user {
    margin: 0;
    font-weight: bold;
    font-size: 1.125rem;
    line-height: 1.75rem; 
  }

  .guest {
    color: #9ca3af;
  }

  .time {
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .trash {
    cursor: pointer;
    color: #ef4444;
    width: 1.5rem;
    height: 1.5rem;
    background-color: transparent;
    border: none;
  }

  .body {
    margin: 0;
  }
</style>