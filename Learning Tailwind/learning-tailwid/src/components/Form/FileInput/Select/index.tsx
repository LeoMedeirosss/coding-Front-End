"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"
import { ReactNode } from "react"

export interface SelectProps extends SelectPrimitive.SelectProps {
    children: ReactNode
    placeholder: string
}

export function Select({children, placeholder, ...props}: SelectProps) {
    return (
        <SelectPrimitive.Root {...props}>
              <SelectPrimitive.Trigger className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-zinc-300 py-2 px-3 shadow-sm data-[placeholder]:text-zinc-600 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-violet-500 dark:focus-within:ring-violet-500/20 dark:data-[placeholder]:text-zinc-400">
                <SelectPrimitive.Value className="text-zinc-900" placeholder={placeholder}>
                </SelectPrimitive.Value>
                <SelectPrimitive.Icon> 
                  <ChevronDown className="h-4 w-4 text-zinc-500"/>
                </SelectPrimitive.Icon>
              </SelectPrimitive.Trigger>

              <SelectPrimitive.Portal>
                <SelectPrimitive.Content 
                    side="bottom" 
                    position="popper" 
                    sideOffset={6}
                    className="z-10 rounded-lg border border-zinc-300 bg-white w-[--radix-select-trigger-width] overflow-hidden animate-slideDownAndFade dark:bg-zinc-800 dark:border-zinc-700"
                >
                   <SelectPrimitive.Viewport>
                       {children}                       
                    </SelectPrimitive.Viewport> 
                </SelectPrimitive.Content>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
    )
}