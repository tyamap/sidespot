import { useMessage } from "@plasmohq/messaging/hook"
import type { PlasmoCSConfig } from "plasmo"
import cssText from "data-text:~style.css"
import { useState } from "react"
import { useForm } from "react-hook-form";
import { type } from "os";
import { useStorage } from "@plasmohq/storage/hook";
import type { Tokens } from "~entities/tokens";
import axios from "axios";

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: false,
  run_at: "document_end",
}

type ContactInputs = {
  email: string
  firstname: string
  lastname: string
  phone?: string
  company?: string
  website?: string
  lifecyclestage?: string
}

const sideform = () => {
  const [show, setShow] = useState(true)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ContactInputs>();
  const [tokens] = useStorage<Tokens>("tokens")

  // ポップアップのボタンをトリガーにサイドフォームの表示切り替え
  useMessage(async (req, _res) => {
    if (req.name === 'toggleSideform') {
      setShow(!show)
    }
  })

  const onSubmit = (data: ContactInputs) => {
    console.log(data)
    createContact({ properties: data })
  };
  // コンタクトの作成
  const createContact = (formData) => {
    const url = "https://api.hubapi.com/crm/v3/objects/contacts"
    const headers = {
      Authorization: `Bearer ${tokens.accessToken}`,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': "*"
    }
    const data = { properties: formData }
    axios.post(url, data, { headers })
      .then((res) => {
        console.log(res.data.results)
      })
  }


  return (
    show &&
    <div className="fixed top-0 right-0 bg-white w-96 h-full drop-shadow-2xl">
      <div className="p-4 bg-orange-500 text-white">コンタクトを作成</div>
      <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={blockStyle}>
            <label className={labelStyle} htmlFor="email">Email</label>
            <input className={inputStyle} type="email" {...register("email")} />
            {errors.email && <span>This field is required</span>}
          </div>
          <div className={blockStyle}>
            <label className={labelStyle} htmlFor="firstname">First Name</label>
            <input className={inputStyle} type="text" {...register("firstname")} />
          </div>
          <div className={blockStyle}>
            <label className={labelStyle} htmlFor="lastname">Last Name</label>
            <input className={inputStyle} type="text" {...register("lastname")} />
          </div>
          <div className={blockStyle}>
            <label className={labelStyle} htmlFor="phone">Phone</label>
            <input className={inputStyle} type="text" {...register("phone")} />
          </div>
          <div className={blockStyle}>
            <label className={labelStyle} htmlFor="company">Company</label>
            <input className={inputStyle} type="text" {...register("company")} />
          </div>
          <div className={blockStyle}>
            <label className={labelStyle} htmlFor="website">Website</label>
            <input className={inputStyle} type="text" {...register("website")} />
          </div>
          <div className={blockStyle}>
            <label className={labelStyle} htmlFor="lifecyclestage">Lifecyclestage</label>
            <input className={inputStyle} type="text" {...register("lifecyclestage")} />
          </div>
          <input className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" type="submit" />
        </form>
      </div>
    </div>
  )
}

export default sideform;

const inputStyle = "bg-gray-100 appearance-none border-2 border-gray-300 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-500"
const labelStyle = "text-black"
const blockStyle = "flex flex-col mb-4"