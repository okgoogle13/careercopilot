/**
 * CLASSIFICATION: Support-Reference Page
 * Prototype-only reference page.
 * CANONICAL ROUTE OWNER: /tracker (applications family)
 */
import React from 'react';
import { motion } from 'motion/react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { SolidarityPageLayout } from '../components/layout/SolidarityPageLayout';
import { LayeredHero } from '../components/layout/LayeredHero';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export function PastApplicationsReference() {
  return (
    <SolidarityPageLayout
      heroNode={
        <LayeredHero
          imageUrl="https://picsum.photos/seed/history/1920/1080?blur=2"
          altText="History Hero"
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
              Past <br />
              <span className="text-[var(--sys-color-solidarityRed-base)]">Applications</span>
            </h1>
            <p className="text-xl type-laborExploitationPressure text-[var(--sys-color-stencilYellow-base)] uppercase tracking-widest">
              THE ARCHIVE. YOUR HISTORY OF STRUGGLE.
            </p>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <Card>
              <SectionHeader
                title="History"
                subtitle="Review and manage your previously tailored applications."
              />
              <div className="space-y-4">
                {/* Placeholder for list */}
                <motion.div
                  whileHover={{ scale: 1.01, rotate: -0.5 }}
                  className="p-6 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer gap-4"
                  style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                >
                  <div>
                    <p className="font-mono text-sm text-[var(--sys-color-stencilYellow-base)] uppercase tracking-widest mb-1">
                      2026-03-15
                    </p>
                    <p className="text-xl text-[var(--sys-color-paperWhite-base)] font-bold">
                      Senior Frontend Engineer @ TechCorp
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      label="Applied"
                      variant="success"
                    />
                    <span className="text-[var(--sys-color-solidarityRed-base)] font-bold uppercase tracking-widest text-sm">
                      View
                    </span>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01, rotate: 0.5 }}
                  className="p-6 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer gap-4"
                  style={{ borderRadius: 'var(--sys-shape-blockRiot03)' }}
                >
                  <div>
                    <p className="font-mono text-sm text-[var(--sys-color-stencilYellow-base)] uppercase tracking-widest mb-1">
                      2026-03-10
                    </p>
                    <p className="text-xl text-[var(--sys-color-paperWhite-base)] font-bold">
                      Full Stack Developer @ StartupX
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      label="Draft"
                      variant="warning"
                    />
                    <span className="text-[var(--sys-color-solidarityRed-base)] font-bold uppercase tracking-widest text-sm">
                      View
                    </span>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </WorkspaceLayout>
    </SolidarityPageLayout>
  );
}
