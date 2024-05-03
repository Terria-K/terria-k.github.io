import { createSignal, type Component, type JSX } from "solid-js";

type FormField = {
  platform: string,
  contactname: string,
  title: string,
  description: string,
  reference: string
}

type FormProp = {
  url: string
}


const Form: Component<FormProp> = (prop) => {
  const [platform, setPlatform] = createSignal("Email");
  const [response, setResponse] = createSignal<string|undefined>(undefined);
  const [responseColor, setResponseColor] = createSignal("text-red-500");
  const [form, setForm] = createSignal<FormField>({
    platform: platform(),
    contactname: "",
    title: "",
    description: "",
    reference: ""
  })


  function updateFormField(formName: string) {
    return (e: Event) => {
      const inputElement = e.currentTarget as HTMLInputElement;
      //@ts-ignore
      setForm({
        ...form(),
        [formName]: inputElement.value
      });
    }
  }

  function onPlatformChange(event: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement; }) {
    setPlatform(event.target.value);
    setForm({
      ...form(),
      platform: event.target.value
    });
  }

  async function onSubmit(e: Event) {
    e.preventDefault();
    const formParam = form();

    const platform = formParam.platform;

    const contactName = formParam.contactname.trim();
    const title = formParam.title.trim();
    const description = formParam.description.trim();
    const reference = formParam.reference.trim();

    if (contactName === "") {
      setResponse("Please provide your contact name.");
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

    const json = {
        "username": "Commission Receiver",
        "avatar_url": "https://i.imgur.com/4M34hi2.png",
        "content": "Commision Up!",
        "embeds": [
            {
              "title": title,
              "description": description,
              "fields": [{
                  "name": "Requested By",
                  "value": contactName
                },
                {
                  "name": "Platform",
                  "value": platform
                },
                {
                  "name": "Reference Links",
                  "value": reference
                }
              ],
            }
        ]
    }

    const url = "https://discord.com/api/webhooks/" + prop.url

    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(json)
    });

    if (res.ok) {
      setResponseColor("text-green-500")
      setResponse("Your order has been sent!");
    } else {
      setResponseColor("text-red-500")
      setResponse("Something went wrong with sending your order. Please try again later.");
    }
  }


  return (
  <form class="grid gap-4" onSubmit={onSubmit}>
    <p class="text-white font-bold text-2xl">Contact</p>
    <Label>
      Platform: *
      <select name="platform" class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" 
        onChange={onPlatformChange} value={platform()}>
        <option class="bg-midnight-light" value="Email">Email</option>
        <option class="bg-midnight-light" value="Discord">Discord</option>
      </select>
    </Label>
    <Label>
      {platform()}: *
      <Input name="contactname" type="text" onChange={updateFormField("contactname")} value={form().contactname} />
      {platform() === "Discord"
          ? <p class="text-gray-400">If you're on Discord, please make yourself available for me to able to contact you, or join in my Discord Server in the icon below.</p>
          : null
      }
    </Label>
    <p class="text-white font-bold text-2xl">Request</p>
    <Label>
      Art Title: *
      <Input name="title" type="text" onChange={updateFormField("title")} value={form().title}/>
    </Label>
    <Label>
      Details: *
      <textarea onChange={updateFormField("description")} class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" name="description" rows="5" cols="30" value={form().description}></textarea>
    </Label>
    <Label>
      References or Idea:
      <p class="text-gray-500 text-sm">You can put a links for references or idea to have a clear idea of what you want.</p>
      <textarea onChange={updateFormField("reference")} class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" name="reference" rows="2" cols="30" value={form().reference}></textarea>
    </Label>
    <p class="text-gray-300 text-lg">
      Prices of each art is minimum of $5 and you can go beyond that if you want to support me more as an artist. <br/>
      You may only pay for the art once it is finished to have a preview of what it looks like before paying for it.
    </p>
    <div>
      <input class="hover:bg-green-400 bg-green-600 duration-300 text-white px-8 py-4 text-xl rounded-xl cursor-pointer" type="submit" value="Order"/>
    </div>
    {
      response() ? <p class={`${responseColor()}`}>{response()}</p> : null
    }
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
  return <input name={prop.name} onChange={prop.onChange} class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" type={prop.type} value={prop.value}/>
}

export default Form;