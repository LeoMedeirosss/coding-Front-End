import { Home, BarChart, CheckSquare, Flag, Search, SquareStack, Users } from "lucide-react";
import { NavItem } from "./NavItem";
import { UsedSpaceWidget } from "./UsedSpaceWidget";
import { Profile } from "./profile";

export function Sidebar() {
    return(
        <aside className="flex flex-col gap-6 border-r border-r-zinc-200 px-5 py-8">
            <strong className="flex items-center text-xl font-semibold text-zinc-900">
                <span>Untitled UI</span>
            </strong>
            <div className="flex w-full items-center gap-2 rounded-large border border-zinc-300 px-3 py-2 shadow-sm">
                <Search className="h-5 w-5 text-zinc-500"/>
                <input type="text" placeholder="Search" className="flex-1 bg-transparent p-0 text-zinc-900 placeholder-zinc-600"/>
            </div>

        <nav className="space-y-0.5 ">
            <NavItem title="Home" icon={Home} />
            <NavItem title="Dashboard" icon={BarChart} />
            <NavItem title="Projects" icon={SquareStack} />
            <NavItem title="Tasks" icon={CheckSquare} />
            <NavItem title="Reporting" icon={Flag} />
            <NavItem title="Users" icon={Users} />
        </nav>

        <UsedSpaceWidget/>

        <div className="h-px bg-zinc-200"/>

        <Profile />
        </aside>
    )
}