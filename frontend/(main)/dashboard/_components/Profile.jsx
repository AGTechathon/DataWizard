import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import React from "react"
import Credits from "./Credits"

function ProfileDialog({children}){
    return(
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription asChild>
                   <Credits/>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
            </Dialog>

    )
}

export default ProfileDialog
