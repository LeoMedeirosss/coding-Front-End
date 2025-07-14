'use client'

import * as Tabs from "@radix-ui/react-tabs"
import {motion} from "framer-motion"

export interface TabItemProps {
    value: string
    title: string
    isSelected?: boolean
}

export function TabItem({value, title, isSelected = false}: TabItemProps) {
    return(
            <Tabs.Trigger 
                value= {value}
                className="whitespace-nowrap relative px-1 pb-2.5 text-sm font-medium text-zinc-500 hover:text-violet-600 data-[state=active]:text-violet-700 dark:text-zinc-400 dark:data-[state=active]:text-violet-300 dark:hover:text-violet-200"
            >
                <span className="">{title}</span>

                {isSelected && (
                    <motion.div layoutId="activeTab" className="absolute -bottom-px left-0 right-0 h-0.5 bg-violet-700 dark:bg-violet-300"/>
                )}
            </Tabs.Trigger>
    )
}