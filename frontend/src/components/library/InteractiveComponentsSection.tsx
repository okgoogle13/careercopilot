/**
 * ELECTRIC ALCHEMIST: INTERACTIVE COMPONENTS SECTION
 *
 * Documentation section showcasing interactive components.
 */

import React, { useState } from 'react';
import { Button } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/electric/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/electric';
import { ComponentSection, ComponentDemo } from './ComponentDemo';

export function InteractiveComponentsSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <ComponentSection
      title="Interactive Components"
      description="Dialogs, popovers, and other interactive overlay components"
    >
      <ComponentDemo title="Dialogs & Modals">
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            Open Dialog
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogClose />
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <p className="text-human text-sm text-on-surface-variant">
                  This is a dialog example with design system tokens.
                </p>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Popovers">
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setIsPopoverOpen(true);
            }}
          >
            Open Popover
          </Button>
          <Popover
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
            anchorEl={anchorEl}
          >
            <PopoverContent>
              <p className="text-human text-sm text-on-surface">
                This is a popover with design system tokens.
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}

export default InteractiveComponentsSection;

