import { LogOut } from "lucide-react";

export function Profile() {
    return(
        <div className="flex items-center gap-3">
            <img 
                src="https://github.com/abcde.png" 
                className="rounded-full h-10 w-10" 
            />
            <div className="flex flex-col flex-1">
                <span className="text-sm font-semibold text-zinc-700">Fulano da Silva</span>
                <span className="text-sm font-semibold text-zinc-400">fulano@github</span>
            </div>
            <button type="button" className="ml-auto p-2 hover:bg-zinc-50 rounded-md">
                <LogOut className="w-5 h-5 text-zinc-500"/>
            </button>
        </div>
    )
}