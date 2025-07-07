import { SettingsTabs } from "@/components/SettingsTabs";
import * as Input from "@/components/Input";
import { Bold, Italic, Link, List, ListOrdered, Mail } from "lucide-react";
import * as FileInput from "@/components/Form/FileInput"
import { Select } from "@/components/Form/FileInput/Select/index";
import { SelectItem } from "@/components/Form/FileInput/Select/SelectItem";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-medium text-zinc-900">Settings</h1>

      <SettingsTabs />

      <div className="mt-6 flex flex-col">
        <div className="flex flex-row justify-between border-b border-zinc-200 pb-5">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-zinc-900">Personal info</h2>
            <span className="text-sm text-zinc-500">
              Update yout pohoto and personal details here.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              className="rounded-lg px-4 py-2 text-sm font-semibold shadow-sm border cursor-pointer border-zinc-300 text-zinc-700 hover:bg-zinc-50"
            >
              cancel
            </button>
            <button 
              type="button" 
              form="settings" 
              className="rounded-lg px-4 py-2 text-sm font-semibold shadow-sm cursor-pointer bg-violet-600 text-white hover:bg-violet-700"
            >
              submit
            </button>
          </div>
        </div>
        <form id="settings" className="mt-6 flex w-full flex-col gap-5 divide-y divide-zinc-200">
          <div className="grid flex-col gap-5 pb-4">
          <div className="grid gap-3 grid-cols-3">
            <label 
              htmlFor="FirstName" 
              className="text-sm font-medium text-zinc-700"
            >
              Name
            </label>
            <div className="grid gap-6 grid-cols-2">
              <Input.Root>
                <Input.Control id="FirstName" defaultValue="Rafael" />
              </Input.Root>

              <Input.Root>
                <Input.Control defaultValue="Silva" />
              </Input.Root>
            </div>
          </div>
          </div>

          <div className="grid flex-col gap-4 pt-2.5 pb-4">
          <div className="grid gap-3 grid-cols-3">
            <label 
              htmlFor="email" 
              className="text-sm font-medium text-zinc-700"
            >
              Email
            </label>
              <Input.Root>
              <Input.Prefix>
                <Mail className="h-5 w-5 text-zinc-500" />
              </Input.Prefix>
                <Input.Control id="email" type="email" defaultValue="RafaelSilva@gmail.com" />
              </Input.Root>
          </div>
          </div>

          <div className="grid flex-col gap-4 pt-2.5 pb-4">
          <div className="grid gap-3 grid-cols-3">
            <label 
              htmlFor="yourphoto" 
              className="text-sm font-medium text-zinc-700"
            >
              Your Photo
              <span 
                className="block mt-1 text-sm font-normal text-zinc-500"
              >
                This will be displayed on your profile
              </span>
            </label>
              <FileInput.Root className="flex flex-row items-start gap-5">
                <FileInput.ImagePreview/>
                <FileInput.Trigger/>
                <FileInput.Control/>
              </FileInput.Root>
          </div>
          </div>

          <div className="grid flex-col gap-4 pt-2.5 pb-4">
          <div className="grid gap-3 grid-cols-3">
            <label 
              htmlFor="role" 
              className="text-sm font-medium text-zinc-700"
            >
              Role
            </label>
              <Input.Root>
                <Input.Control id="role"  defaultValue="CTD" />
              </Input.Root>
          </div>
          </div>

          <div className="grid flex-col gap-4 pt-2.5 pb-4">
          <div className="grid gap-3 grid-cols-3">
            <label 
              htmlFor="country" 
              className="text-sm font-medium text-zinc-700"
            >
              Country
            </label>
            <Select placeholder="Select a contry...">
              <SelectItem value="br" text="Brazil"/>
              <SelectItem value="us" text="United States"/>
              <SelectItem value="gr" text="Germany"/>
              <SelectItem value="uk" text="United Kingdom"/>
              <SelectItem value="jm" text="Jamaica"/>
            </Select>
            
          </div>
          </div>

          <div className="grid flex-col gap-4 pt-2.5 pb-4">
          <div className="grid gap-3 grid-cols-3">
            <label 
              htmlFor="timezone" 
              className="text-sm font-medium text-zinc-700"
            >
              Timezone
            </label>
            <Select placeholder="Select a timezone...">
              <SelectItem value="utc8" text="Pacific Standard Time (UTC-08:00)"/>
              <SelectItem value="utc3" text="America São Paulo (UTC-03:00"/>
            </Select>
          </div>
          </div>

          <div className="grid flex-col gap-4 pt-2.5 pb-4">
          <div className="grid gap-3 grid-cols-3">
            <label 
              htmlFor="bio" 
              className="text-sm font-medium text-zinc-700"
            >
              Bio
              <span 
                className="block mt-1 text-sm font-normal text-zinc-500"
              >
                Write your introduction.
              </span>
            </label>
            <div className="space-y-3">
              <div className="grid gap-3 grid-cols-2">
                <Select placeholder="" defaultValue="normal">
                  <SelectItem 
                    value="normal" 
                    defaultChecked 
                    text="Normal Text"
                  />
                  <SelectItem value="md" text="MarkDown"/>
                </Select>
                <div className="flex items-center gap-1">
                  <button type="button" className=" p-2 hover:bg-zinc-50 rounded-md">
                    <Bold className="w-3.5 h-3.5 text-zinc-500" strokeWidth={3}/>
                  </button>
                  <button type="button" className=" p-2 hover:bg-zinc-50 rounded-md">
                    <Italic className="w-3.5 h-3.5 text-zinc-500" strokeWidth={3}/>
                  </button>
                  <button type="button" className=" p-2 hover:bg-zinc-50 rounded-md">
                    <Link className="w-3.5 h-3.5 text-zinc-500" strokeWidth={3}/>
                  </button>
                  <button type="button" className=" p-2 hover:bg-zinc-50 rounded-md">
                    <List className="w-3.5 h-3.5 text-zinc-500" strokeWidth={3}/>
                  </button>
                  <button type="button" className=" p-2 hover:bg-zinc-50 rounded-md">
                    <ListOrdered className="w-3.5 h-3.5 text-zinc-500" strokeWidth={3}/>
                  </button>
                </div>
              </div>
              <textarea 
                className="min-h-[128px] resize-y w-full rounded-lg border border-zinc-300 py-2 px-3 shadow-sm"
                name="bio" 
                id="bio" defaultValue="Im a Product Designer based in Melbourne, Australia. I specialize in UX/UI desing."
              >
              </textarea>
            </div>
          </div>
          </div>

          <div className="grid flex-col gap-4 pt-2.5 pb-4">
          <div className="grid gap-3 grid-cols-3">
            <label 
              htmlFor="projects" 
              className="text-sm font-medium text-zinc-700"
            >
              Portfolio projects
              <span 
                className="block mt-1 text-sm font-normal text-zinc-500"
              >
                Share a few snippets of your work
              </span>
            </label>
            <FileInput.Root>
              <FileInput.Trigger/>
              <FileInput.FileList/>
              <FileInput.Control multiple />
            </FileInput.Root>
          </div>
          </div>


          <div className="flex items-center justify-end gap-2 pt-4">
            <button 
              type="button" 
              className="rounded-lg px-4 py-2 text-sm font-semibold shadow-sm border cursor-pointer border-zinc-300 text-zinc-700 hover:bg-zinc-50"
            >
              cancel
            </button>
            <button 
              type="button" 
              className="rounded-lg px-4 py-2 text-sm font-semibold shadow-sm cursor-pointer bg-violet-600 text-white hover:bg-violet-700"
            >
              submit
            </button>
          </div>

        </form>
      </div>
    </>
  );
}