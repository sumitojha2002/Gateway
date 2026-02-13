"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteJobMutation } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function JobDeleteButton({
  id,
  name,
}: {
  id: string | number;
  name: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteJob, { isLoading }] = useDeleteJobMutation();
  //console.log(id);
  const handleDelete = async () => {
    try {
      await deleteJob(id).unwrap();
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <>
      {/* Trigger */}
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
        className="flex-1"
      >
        Delete
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {name}?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This action cannot be undone. Are you sure you want to delete this{" "}
            {name}?
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
