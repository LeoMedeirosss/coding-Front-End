"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

export function Select() {
    return (
        <SelectPrimitive.Root>
              <SelectPrimitive.Trigger className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-zinc-300 py-2 px-3 shadow-sm data-[placeholder]:text-zinc-600">
                <SelectPrimitive.Value className="text-zinc-900" placeholder="Select a contry...">
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
                    className="z-10 rounded-lg border border-zinc-300 bg-white w-[--radix-select-trigger-width] overflow-hidden"
                >
                   <SelectPrimitive.Viewport>
                        <SelectPrimitive.Item 
                            className="flex items-center justify-between gap-2 px-3 py-2 outline-none data-[highLighted]:bg-zinc-50" 
                            value="br"
                        >
                            <SelectPrimitive.ItemText className="text-zinc-950">
                                Brazil
                            </SelectPrimitive.ItemText>

                            <SelectPrimitive.ItemIndicator/>
                            <Check className="h-3.5 w-3.5 text-violet-500"/>
                        </SelectPrimitive.Item>
                        <SelectPrimitive.Item 
                            className="flex items-center justify-between gap-2 px-3 py-2 outline-none data-[highLighted]:bg-zinc-50" 
                            value="us"
                        >
                            <SelectPrimitive.ItemText className="text-zinc-950">
                                United States
                            </SelectPrimitive.ItemText>

                            <SelectPrimitive.ItemIndicator/>
                            <Check className="h-3.5 w-3.5 text-violet-500"/>
                        </SelectPrimitive.Item>                        
                    </SelectPrimitive.Viewport> 
                </SelectPrimitive.Content>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
    )
}