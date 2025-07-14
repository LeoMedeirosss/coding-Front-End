"use client"

import { Home, BarChart, CheckSquare, Flag, Search, SquareStack, Users, Menu } from "lucide-react";
import { NavItem } from "./NavItem";
import { UsedSpaceWidget } from "./UsedSpaceWidget";
import { Profile } from "./Profile";
import * as Collapsible from "@radix-ui/react-collapsible"
import * as Input from "../Input";
import { Button } from "../Button";

export function Sidebar() {
    return(
        <Collapsible.Root className="flex flex-col gap-6 border-b border-zinc-200 px-5 py-8 left-0 top-0 data-[state=open]:h-screen data-[state=open]:bottom-0 lg:data-[state=closed]:bottom-0 p-4 right-0 fixed bg-white z-20 lg:right-auto lg:w-75 lg:border-r lg:px-5 lg-py-7 lg:data-[state=closed]:h-screen dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex items-center justify-between">
                <strong className="flex items-center text-xl font-semibold text-zinc-900 dark:text-zinc-200">
                    <span>Untitled UI</span>
                    <Collapsible.Trigger asChild className="lg:hidden">
                        <Button variant="ghost">
                            <Menu className="h-5 w-5"/>
                        </Button>
                    </Collapsible.Trigger>
                </strong>
            </div>

            <Collapsible.Content 
                forceMount 
                className="flex flex-1 flex-col gap-5 data-[state=closed]:hidden lg:data-[state=closed]:flex"
            >
                <Input.Root>
                    <Input.Prefix>
                        <Search className="h-5 w-5 text-zinc-500" />
                    </Input.Prefix>
                    <Input.Control placeholder="Search"/>
                </Input.Root>

            <nav className="space-y-0.5 pb-1 pt-1">
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
            </Collapsible.Content>

        </Collapsible.Root>
    )
}