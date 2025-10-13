import React from 'react';
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
} from '../ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ComponentSection, ComponentDemo } from './ComponentDemo';
import { Button, IconButton } from '@mui/material';

export function InteractiveComponentsSection() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);

  return (
    <ComponentSection
      title="Interactive Components"
      description="Dialogs, popovers, and other interactive overlay components"
    >
      <ComponentDemo title="Dialogs & Modals">
        <div className="flex flex-wrap gap-4">
          <Button variant="outlined" onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog description that explains what this dialog is for.
              </DialogDescription>
            </DialogHeader>
            <DialogContent>
              <div className="py-4">
                <p>Dialog content goes here.</p>
              </div>
            </DialogContent>
            <DialogFooter>
              <Button variant="outlined" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsDialogOpen(false)}>Confirm</Button>
            </DialogFooter>
          </Dialog>

          <Button variant="outlined" onClick={() => setIsAlertDialogOpen(true)}>Delete Item</Button>
          <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the item.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setIsAlertDialogOpen(false)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialog>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Popovers & Tooltips">
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outlined">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Popover Title</h4>
                <p className="text-sm text-muted-foreground">
                  This is a popover with some content inside it.
                </p>
                <div className="flex gap-2">
                  <Button size="small">Action</Button>
                  <Button variant="outlined" size="small">
                    Cancel
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outlined">Hover for Tooltip</Button>
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
