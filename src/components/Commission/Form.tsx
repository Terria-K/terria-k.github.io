import { $, Slot, component$, useSignal, useStore, sync$ } from "@builder.io/qwik"

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


const Form = component$((prop: FormProp) => {
  const platform = useSignal("Email");
  const response = useSignal<string|undefined>(undefined);
  const responseColor = useSignal("text-red-500");
  let form = useStore<FormField>({
    platform: platform.value,
    contactname: "",
    title: "",
    description: "",
    reference: ""
  })


  function updateFormField(formName: string) {
    return $((e: Event) => {
      //@ts-ignore
      form[formName] = e.target.value!;
    })
  }

  const onPlatformChange$ = $(function onPlatformChange(event: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement; }) {
    platform.value = event.target.value;
    form.platform = event.target.value;
  })

  const onSubmit$ = $(async function onSubmit(e: Event) {
    const formParam = form;

    const platform = formParam.platform;

    const contactName = formParam.contactname;
    const title = formParam.title;
    const description = formParam.description;
    let reference = formParam.reference;

    if (contactName === "") {
      response.value = "Please provide your contact name.";
      responseColor.value = "text-red-500";
      return;
    }

    if (title === "") {
      response.value = "Please provide the title of the art.";
      responseColor.value = "text-red-500";
      return;
    }

    if (description === "") {
      response.value = "Please provide the details of the art.";
      responseColor.value = "text-red-500";
      return;
    }
    
    if (!reference) {
      reference = "";
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
      response.value = "Your order has been sent!";
      responseColor.value = "text-green-500";
    } else {
      response.value = "Something went wrong with sending your order. Please try again later.";
      responseColor.value = "text-green-500";
    }
  })


  return (
  <form class="grid gap-4" onSubmit$={[sync$((event: Event) => event.preventDefault()), onSubmit$]}>
    <p class="text-white font-bold text-2xl">Contact</p>
    <Label>
      Platform: *
      <select name="platform" class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" 
        onChange$={onPlatformChange$} value={platform.value}>
        <option class="bg-midnight-light" value="Email">Email</option>
        <option class="bg-midnight-light" value="Discord">Discord</option>
      </select>
    </Label>
    <Label>
      {platform.value}: *
      <Input name="contactname" type="text" onChange={updateFormField("contactname")} value={form.contactname} />
    </Label>
    <p class="text-white font-bold text-2xl">Request</p>
    <Label>
      Art Title: *
      <Input name="title" type="text" onChange={updateFormField("title")} value={form.title}/>
    </Label>
    <Label>
      Details: *
      <textarea onChange$={updateFormField("description")} class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" name="description" rows={5} cols={30} value={form.description}></textarea>
    </Label>
    <Label>
      References or Idea:
      <p class="text-gray-500 text-sm">You can put a links for references or idea to have a clear idea of what you want.</p>
      <textarea onChange$={updateFormField("reference")} class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" name="reference" rows={2} cols={30} value={form.reference}></textarea>
    </Label>
    <p class="text-gray-300 text-lg">
      Prices of each art is minimum of $5 and you can go beyond that if you want to support me more as an artist. <br/>
      You may only pay for the art once it is finished to have a preview of what it looks like before paying for it.
    </p>
    <div>
      <input class="hover:bg-green-400 bg-green-600 duration-300 text-white px-8 py-4 text-xl rounded-xl cursor-pointer" type="submit" value="Order"/>
    </div>
    {
      response.value ? <p class={`${responseColor.value}`}>{response.value}</p> : null
    }
  </form>)
});

const Label = component$(() => {
  return (<label class="flex flex-col text-white">
    <Slot/>
  </label>)
});

const Input = component$((prop: {
  type: string,
  name?: string,
  value?: string,
  onChange: (e: Event) => void
}) => {
  return <input name={prop.name} onChange$={prop.onChange} class="py-2 px-2 bg-transparent rounded border-2 border-midnight-light" type={prop.type} value={prop.value}/>
});

export default Form;