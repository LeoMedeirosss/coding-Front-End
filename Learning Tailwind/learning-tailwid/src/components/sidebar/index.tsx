import { Search } from "lucide-react";

export interface SidebarProps{}

export function Sidebar(props:SidebarProps) {
    return(
        <aside className="border-r border-r-zinc-200 px-5 py-8 space-y-5">
            <strong className="flex items-center text-xl font-semibold text-zinc-900">
                <span>Untitled UI</span>
            </strong>

            <div className="flex w-full items-center gap-2 rounded-large border border-zinc-300 px-3 py-2 shadow-sm">
                <Search className="h-5 w-5 text-zinc-500"/>
                <input type="text" placeholder="Search" className="flex-1 bg-transparent p-0 text-zinc-900 placeholder-zinc-600"/>
            </div>
        </aside>
    )
}