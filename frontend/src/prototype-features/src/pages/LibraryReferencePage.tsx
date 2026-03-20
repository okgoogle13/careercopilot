/* eslint-disable */
/**
 * CLASSIFICATION: Support-Reference Page
 * Prototype-only reference page.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { SolidarityPageLayout } from '../components/layout/SolidarityPageLayout';
import { LayeredHero } from '../components/layout/LayeredHero';
import {
  SectionHeader,
  PrimaryButton,
  TextInput,
  Textarea,
  Card,
  Badge,
  Loader,
  Modal,
} from '@/components/PrototypeAdapter';
import { Checkbox } from '../components/ui/Checkbox';

export function LibraryReferencePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <SolidarityPageLayout
      heroNode={
        <LayeredHero
          imageUrl="https://picsum.photos/seed/components/1920/1080?blur=2"
          altText="Components Hero"
        />
      }
    >
      <WorkspaceLayout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="space-y-16"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="mb-12"
          >
            <h1 className="text-7xl type-extremeVariableContrast text-[var(--sys-color-paperWhite-base)] uppercase tracking-tighter leading-none mb-4">
              Component <br />
              <span className="text-[var(--sys-color-solidarityRed-base)]">Library</span>
            </h1>
            <p className="text-xl type-laborExploitationPressure text-[var(--sys-color-stencilYellow-base)] uppercase tracking-widest">
              THE BUILDING BLOCKS OF THE REVOLUTION.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.section
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <SectionHeader
              title="Buttons"
              subtitle="Primary actions and secondary alternatives."
            />
            <div className="flex flex-wrap gap-8">
              <PrimaryButton
                label="Strike Action"
                onClick={() => {}}
                variant="strike"
              />
              <PrimaryButton
                label="March Forward"
                onClick={() => {}}
                variant="march"
              />
              <PrimaryButton
                label="Disabled State"
                onClick={() => {}}
                disabled
              />
            </div>
          </motion.section>

          {/* Inputs */}
          <motion.section
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <SectionHeader
              title="Inputs"
              subtitle="Text fields and textareas."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TextInput
                label="Target Role"
                placeholder="e.g. Senior Frontend Engineer"
              />
              <TextInput
                label="Company Name"
                placeholder="e.g. TechCorp Inc."
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Job Description"
                  placeholder="Paste the full job description here..."
                />
              </div>
            </div>
          </motion.section>

          {/* Cards & Badges */}
          <motion.section
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <SectionHeader
              title="Cards & Badges"
              subtitle="Containers and status indicators."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card hoverEffect>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] uppercase">
                    Placard Card
                  </h3>
                  <Badge
                    label="New"
                    variant="warning"
                  />
                </div>
                <p className="type-melancholyLonging text-[var(--sys-color-worker-ash-base)]">
                  This is a standard card component with a hover effect. It uses the placard torn
                  shape.
                </p>
                <div className="mt-6 flex gap-2 flex-wrap">
                  <Badge label="Default" />
                  <Badge
                    label="Success"
                    variant="success"
                  />
                  <Badge
                    label="Danger"
                    variant="danger"
                  />
                </div>
              </Card>
              <Card>
                <h3 className="text-2xl type-solidarityProtest text-[var(--sys-color-paperWhite-base)] uppercase mb-4">
                  Static Card
                </h3>
                <p className="type-melancholyLonging text-[var(--sys-color-worker-ash-base)]">
                  This card does not have a hover effect. Useful for static content display.
                </p>
              </Card>
            </div>
          </motion.section>

          {/* Controls */}
          <motion.section
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <SectionHeader
              title="Controls & Modals"
              subtitle="Interactive elements and overlays."
            />
            <div className="flex flex-col gap-8 items-start">
              <Checkbox
                label="I agree to the terms of the revolution"
                checked={isChecked}
                onChange={setIsChecked}
              />
              <PrimaryButton
                label="Open Modal"
                onClick={() => setIsModalOpen(true)}
                variant="march"
              />
            </div>
          </motion.section>

          {/* Loader */}
          <motion.section
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <SectionHeader
              title="Loader"
              subtitle="Processing state indicator."
            />
            <Card className="flex justify-center">
              <Loader message="Analyzing Data..." />
            </Card>
          </motion.section>
        </motion.div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="System Alert"
        >
          <p className="type-melancholyLonging text-lg text-[var(--sys-color-worker-ash-base)]">
            This is a modal dialog. It uses a spring animation to enter and exit the screen, and
            features a backdrop blur.
          </p>
          <div className="flex justify-end mt-8">
            <PrimaryButton
              label="Acknowledge"
              onClick={() => setIsModalOpen(false)}
              variant="strike"
            />
          </div>
        </Modal>
      </WorkspaceLayout>
    </SolidarityPageLayout>
  );
}
