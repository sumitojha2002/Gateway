"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function LogOutButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={"destructive"}
        className="w-full h-full bg-white text-red-600 rounded-none! hover:text-red-400 hover:bg-gray-100"
        //className="h-full w-full text-red-600 bg-white hover:text-red-500 hover:bg"
      >
        Log Out
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Out </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to Log Out ?
          </p>

          <DialogFooter>
            <div className="w-full flex justify-end gap-2">
              <Button
                variant="destructive"
                className="w-1/4"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                className="w-1/4"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
