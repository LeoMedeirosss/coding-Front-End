import { Home, BarChart, CheckSquare, Flag, Search, SquareStack, Users } from "lucide-react";
import { NavItem } from "./NavItem";
import { UsedSpaceWidget } from "./UsedSpaceWidget";
import { Profile } from "./Profile";
import * as Input from "../Input";

export function Sidebar() {
    return(
        <aside className="flex flex-col gap-6 border-b border-zinc-200 px-5 py-8 left-0 top-0 bottom-0 p-4 right-0 fixed bg-white z-20 lg:right-auto lg:w-75 lg:border-r lg:px-5 lg-py-7 lg:relative">
            <strong className="flex items-center text-xl font-semibold text-zinc-900">
                <span>Untitled UI</span>
            </strong>
            <Input.Root>
                <Input.Prefix>
                    <Search className="h-5 w-5 text-zinc-500" />
                </Input.Prefix>
                <Input.Control placeholder="Search"/>
            </Input.Root>

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