/* eslint-disable */
/**
 * CLASSIFICATION: Support-Reference Page
 * Prototype-only reference page.
 */
import React from 'react';
import { motion } from 'motion/react';
import { WorkspaceLayout } from '../src/components/layout/WorkspaceLayout';
import { SolidarityPageLayout } from '../src/components/layout/SolidarityPageLayout';
import { LayeredHero } from '../src/components/layout/LayeredHero';
import { ImageStudio } from './ImageStudio';

export function ImageStudioPage() {
  return (
    <SolidarityPageLayout
      heroNode={
        <LayeredHero
          imageUrl="https://picsum.photos/seed/imagestudio/1920/1080?blur=2"
          altText="Image Studio Hero"
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
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="mb-12"
          >
            <h1 className="text-7xl type-extremeVariableContrast text-[var(--sys-color-paperWhite-base)] uppercase tracking-tighter leading-none mb-4">
              Image <br />
              <span className="text-[var(--sys-color-solidarityRed-base)]">Studio</span>
            </h1>
            <p className="text-xl type-laborExploitationPressure text-[var(--sys-color-stencilYellow-base)] uppercase tracking-widest">
              GENERATE AND EDIT IMAGES
            </p>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <ImageStudio />
          </motion.div>
        </motion.div>
      </WorkspaceLayout>
    </SolidarityPageLayout>
  );
}
