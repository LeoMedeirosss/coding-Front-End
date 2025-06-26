import { SettingsTabs } from "@/components/SettingsTabs";
import * as Input from "@/components/Input";
import { Mail } from "lucide-react";

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
            <div></div>
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
            <div></div>
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
            <div></div>
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
            <div></div>
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
            <div></div>
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