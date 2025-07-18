import { ComponentProps } from "react"
import { tv, VariantProps } from "tailwind-variants"

const button = tv({
    base: [
        "rounded-lg px-4 py-2 text-sm font-semibold outline-none shadow-sm cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500",
        "active:opacity-80",
    ],

    variants: {
        variant:{
            primary: "bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:bg-violet-600",
            ghost: "rounded-md px-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-zinc-400 shadow-none",
            outline: "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800",
        }
    },
})

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof button>

export function Button({variant,...props}: ButtonProps) {
    return(
        <button 
            {...props}
            className={button({variant})}
        />
    )
}
