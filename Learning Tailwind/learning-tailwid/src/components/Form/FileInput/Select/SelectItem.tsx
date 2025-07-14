"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { Check } from "lucide-react"

export type SelectItemProps = SelectPrimitive.SelectItemProps & {
    text: string
}



export function SelectItem({text, ...props}: SelectItemProps) {
    return(
        <SelectPrimitive.Item 
            className="flex items-center justify-between gap-2 px-3 py-2 outline-none data-[highLighted]:bg-zinc-50 dark:data-[highlighted]:bg-zinc-700" 
            {...props}
        >
            <SelectPrimitive.ItemText asChild>
                <span className="text-zinc-950 dark:text-zinc-200">{text}</span>
            </SelectPrimitive.ItemText>

            <SelectPrimitive.ItemIndicator>
                <Check className="h-3.5 w-3.5 text-violet-500 dark:text-violet-300"/>
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    )
}