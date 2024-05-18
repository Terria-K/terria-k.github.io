import { Show, createEffect, createSignal, type Component, type JSX } from "solid-js";

type FormField = {
  platform: string,
  contactname: string,
  title: string,
  description: string,
  reference: string,
  size: string,
  width: number,
  height: number
}


const Form: Component = () => {
  const [response, setResponse] = createSignal<string|undefined>(undefined);
  const [responseColor, setResponseColor] = createSignal("text-red-500");
  const [enabled, setEnabled] = createSignal(false);
  const [form, setForm] = createSignal<FormField>({
    platform: "Email",
    contactname: "",
    title: "",
    description: "",
    reference: "",
    size: "Landscape",
    width: 512,
    height: 512
  })


  function updateFormField(formName: string) {
    return (e: Event) => {
      const inputElement = e.currentTarget as HTMLInputElement;

      setForm({
        ...form(),
        [formName]: inputElement.value
      });
    }
  }

  async function onSubmit(e: Event) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const platform = (formData.get("platform")?.valueOf() as string).trim();

    const contactName = (formData.get("contactname")?.valueOf() as string).trim();
    const title = (formData.get("title")?.valueOf() as string).trim();
    const description = (formData.get("description")?.valueOf() as string).trim();
    const size = (formData.get("size")?.valueOf() as string).trim();
    const width = formData.get("width")?.valueOf() as number
    const height = formData.get("height")?.valueOf() as number

    if (contactName === "") {
      if (platform === "Discord") {
        setResponse("Please provide your Discord username or your Discord ID.");
      } else {
        setResponse("Please provide your contact email.");
      }
      setResponseColor("text-red-500");
      return;
    }

    if (title === "") {
      setResponse("Please provide the title of the art.");
      setResponseColor("text-red-500");
      return;
    }

    if (description === "") {
      setResponse("Please provide the details of the art.");
      setResponseColor("text-red-500");
      return;
    }

    if (size === "Custom") {
      if (width < 512) {
        setResponse("The width must be at minimum of 512 pixels");
        setResponseColor("text-red-500");
        return;
      }
      if (height < 512) {
        setResponse("The height must be at minimum of 512 pixels");
        setResponseColor("text-red-500");
        return;
      }
      if (width > 2500) {
        setResponse("The width must be at maximum of 2500 pixels");
        setResponseColor("text-red-500");
        return;
      }
      if (height > 2500) {
        setResponse("The height must be at maximum of 2500 pixels");
        setResponseColor("text-red-500");
        return;
      }
    }

    const res = await fetch("/api/request", {
      method: "POST",
      body: formData
    })

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        setResponseColor("text-green-500")
      } else {
        setResponseColor("text-red-500")
      }

      setResponse(json.message);
    } else {
      setResponseColor("text-red-500")
      setResponse("Something went wrong with sending your order. Please try again later.");
    }
  }

  createEffect(async () => {
    const result = await fetch("/api/open");
    if (result.ok) {
      const isDisabled = await result.json();
      setEnabled(!isDisabled.r);
      return;
    } 
  });


  return (
  <form class="grid gap-4" onSubmit={onSubmit}>
    <p class="text-white font-bold text-2xl">Contact</p>
    <Label>
      <p>Platform: <span class="text-red-400">*</span></p>
      <select name="platform" class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" 
        onChange={updateFormField("platform")} value={form().platform}>
        <option class="bg-midnight-light" value="Email">Email</option>
        <option class="bg-midnight-light" value="Discord">Discord</option>
      </select>
    </Label>
    <Label>
      <p>{form().platform}: <span class="text-red-400">*</span></p>
      <Input name="contactname" type="text" onChange={updateFormField("contactname")} value={form().contactname} />
      <Show when={form().platform === "Discord"}>
        <p class="text-gray-400">If you're on Discord, please make yourself available for me to able to contact you, or join in my Discord Server in the icon below.</p>
      </Show>
    </Label>
    <p class="text-white font-bold text-2xl">Request</p>
    <Label>
      <p>Art Title: <span class="text-red-400">*</span></p>
      <Input name="title" type="text" onChange={updateFormField("title")} value={form().title}/>
    </Label>
    <Label>
      <p>Details: <span class="text-red-400">*</span></p>
      <textarea onChange={updateFormField("description")} class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" name="description" rows="5" cols="30" value={form().description}></textarea>
    </Label>
    <Label>
      <p>Size: <span class="text-red-400">*</span></p>
      <Show when={form().size === "Landscape"}>
        <p class="text-gray-400">Landscape mode is recommended as Teuria is a Landscape artist, but feel free to use whatever you want.</p>
      </Show>
      <select name="size" class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" 
        onChange={updateFormField("size")} value={form().size}>
        <option class="bg-midnight-light" value="Landscape">Landscape</option>
        <option class="bg-midnight-light" value="Portrait">Portrait</option>
        <option class="bg-midnight-light" value="Custom">Custom</option>
      </select>
      <Show when={form().size === "Custom"}>
        <p class="text-gray-400">Please fill up the width and height for the size of the art. (pixel)</p>
        <p>Width: <span class="text-red-400">*</span></p>
        <Input name="width" type="number" onChange={updateFormField("width")} value={form().width.toString()}/>
        <p>Height: <span class="text-red-400">*</span></p>
        <Input name="height" type="number" onChange={updateFormField("height")} value={form().height.toString()}/>
      </Show>
    </Label>
    <Label>
      References or Idea:
      <p class="text-gray-500 text-sm">You can put a links for references or idea to have a clear idea of what you want.</p>
      <textarea onChange={updateFormField("reference")} class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" name="reference" rows="2" cols="30" value={form().reference}></textarea>
    </Label>
    <p class="text-gray-300 text-lg">
      Prices of each art is minimum of $10 and you can go beyond that if you want to support me more as an artist. <br/>
      You may only pay for the art once it is finished to have a preview of what it looks like before paying for it.
    </p>
    <div>
      <input disabled={!enabled()} class="disabled:bg-gray-500 hover:bg-green-400 bg-green-600 duration-300 text-white px-8 py-4 text-xl rounded-xl cursor-pointer" 
        type="submit" 
        value={!enabled() ? "Closed" : "Order"}/>
    </div>

    <Show when={response()}>
      <p class={`${responseColor()}`}>{response()}</p>
    </Show>

  </form>)
}

const Label: Component<{children?: JSX.Element }> = (prop) => {
  return <label class="flex flex-col text-white">{prop.children}</label>
}

const Input: Component<{
  type: string,
  name?: string,
  value?: string,
  onChange: (e: Event) => void
}> = (prop) => {
  return <input name={prop.name} onChange={prop.onChange} class="my-2 py-2 px-2 bg-transparent rounded border-2 border-midnight-light" type={prop.type} value={prop.value}/>
}

export default Form;