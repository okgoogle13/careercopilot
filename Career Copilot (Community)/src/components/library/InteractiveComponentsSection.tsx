import React from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ComponentSection, ComponentDemo } from "./ComponentDemo";

export function InteractiveComponentsSection() {
  return (
    <ComponentSection
      title="Interactive Components"
      description="Dialogs, popovers, and other interactive overlay components"
    >
      <ComponentDemo title="Dialogs & Modals">
        <div className="flex flex-wrap gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a dialog description that explains what this dialog is for.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Dialog content goes here.</p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Item</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Popovers & Tooltips">
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Popover Title</h4>
                <p className="text-sm text-muted-foreground">
                  This is a popover with some content inside it.
                </p>
                <div className="flex gap-2">
                  <Button size="sm">Action</Button>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover for Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a helpful tooltip</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}
