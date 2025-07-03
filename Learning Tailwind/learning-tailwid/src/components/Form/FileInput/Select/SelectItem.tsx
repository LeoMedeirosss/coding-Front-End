"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { Check } from "lucide-react"

export type SelectItemProps = SelectPrimitive.SelectItemProps & {
    text: string
}



export function SelectItem({text, ...props}: SelectItemProps) {
    return(
        <SelectPrimitive.Item 
            className="flex items-center justify-between gap-2 px-3 py-2 outline-none data-[highLighted]:bg-zinc-50" 
            {...props}
        >
            <SelectPrimitive.ItemText className="text-zinc-950">
                {text}
            </SelectPrimitive.ItemText>

            <SelectPrimitive.ItemIndicator>
                <Check className="h-3.5 w-3.5 text-violet-500"/>
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    )
}