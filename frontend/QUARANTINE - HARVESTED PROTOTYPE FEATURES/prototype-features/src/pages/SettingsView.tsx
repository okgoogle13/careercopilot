import React, { useState } from 'react';
import { SolidarityPageLayout } from '../components/layout/SolidarityPageLayout';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { LayeredHero } from '../components/layout/LayeredHero';
import { Placard } from '../../../components/ui/Placard';
import { Modal } from '../components/ui/Modal';

// Mock M3Button if not available in careercopilot yet, or use local PrimaryButton
const M3Button = ({ children, variant, onClick, className }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all ${
      variant === 'filled'
        ? 'bg-[var(--sys-color-solidarityRed-base)] text-white'
        : variant === 'tonal'
          ? 'bg-[var(--sys-color-charcoalBackground-steps-4)] text-[var(--sys-color-worker-ash-base)]'
          : 'border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-worker-ash-base)]'
    } ${className}`}
  >
    {children}
  </button>
);

export const SettingsView = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <SolidarityPageLayout
      heroNode={
        <LayeredHero
          imageUrl="https://picsum.photos/seed/settings/1920/1080?blur=4"
          altText="Settings Hero"
        />
      }
    >
      <WorkspaceLayout>
        <div className="max-w-4xl mx-auto py-12 px-6">
          <header className="mb-12">
            <h1 className="text-4xl font-black type-solidarityProtest text-[var(--sys-color-paperWhite-base)] mb-4">
              Account & Settings
            </h1>
            <p className="text-[var(--sys-color-worker-ash-base)] opacity-80">
              Manage your account preferences, security, and data.
            </p>
          </header>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] mb-4">
                Security
              </h2>
              <Placard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[var(--sys-color-paperWhite-base)]">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-[var(--sys-color-worker-ash-base)]">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <M3Button variant="tonal">Enable</M3Button>
                </div>
              </Placard>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] mb-4">
                Privacy
              </h2>
              <Placard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[var(--sys-color-paperWhite-base)]">
                      Data Export
                    </h3>
                    <p className="text-sm text-[var(--sys-color-worker-ash-base)]">
                      Download a copy of your data.
                    </p>
                  </div>
                  <M3Button variant="outlined">Download JSON</M3Button>
                </div>
                <div className="mt-8 pt-6 border-t border-[var(--sys-color-outline-variant)] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[var(--sys-color-solidarityRed-base)]">
                      Delete Account
                    </h3>
                    <p className="text-sm text-[var(--sys-color-worker-ash-base)]">
                      Permanently remove your account and all data.
                    </p>
                  </div>
                  <M3Button
                    variant="outlined"
                    onClick={() => setShowDeleteModal(true)}
                    className="border-[var(--sys-color-solidarityRed-base)]/30 text-[var(--sys-color-solidarityRed-base)]"
                  >
                    Delete...
                  </M3Button>
                </div>
              </Placard>
            </section>
          </div>
        </div>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete My Data"
        >
          <div className="p-8">
            <p className="text-[var(--sys-color-worker-ash-base)] mb-8">
              Are you sure you want to delete all your data? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <M3Button
                variant="outlined"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </M3Button>
              <M3Button
                variant="filled"
                onClick={() => {
                  setShowDeleteModal(false);
                  console.log('Data deleted');
                }}
              >
                Delete Account
              </M3Button>
            </div>
          </div>
        </Modal>
      </WorkspaceLayout>
    </SolidarityPageLayout>
  );
};

export default SettingsView;
