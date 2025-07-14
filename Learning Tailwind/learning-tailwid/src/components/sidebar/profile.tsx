import { LogOut } from "lucide-react";
import { Button } from "../Button";

export function Profile() {
    return(
        <div className="flex items-center gap-3">
            <img 
                src="https://github.com/abcde.png" 
                className="rounded-full h-10 w-10" 
            />
            <div className="flex flex-col flex-1">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Fulano da Silva</span>
                <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-600">fulano@github</span>
            </div>
            <Button 
                type="button"
                variant="ghost"
            >
                <LogOut className="w-5 h-5 text-zinc-500"/>
            </Button>
        </div>
    )
}