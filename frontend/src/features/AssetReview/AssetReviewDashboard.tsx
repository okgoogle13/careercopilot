/**
 * kr-solidarity v3.0.0 Asset Review Dashboard
 * Human review workflow for governance overrides and bulk decisions.
 */

import React, { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';

interface PendingAsset {
  asset_id: string;
  name: string;
  category: string;
  score: number;
  approval_status: string;
  violations: string[];
  warnings: string[];
  governance_passed: boolean;
  political_significance: string;
  text_content?: string;
  color_palette?: Record<string, string>;
  sample_image_url?: string;
}

interface ReviewStats {
  total_assets_pending: number;
  assets_approved: number;
  assets_rejected: number;
  assets_conditional: number;
  average_review_time: number;
  reviewers_active: string[];
  pending_overrides: number;
}

/**
 * Main Asset Review Dashboard Component
 *
 * Features:
 * - View pending assets for review
 * - Submit individual reviews with governance overrides
 * - Bulk accept/reject operations
 * - Dashboard statistics
 * - Review history export
 */
export const AssetReviewDashboard: React.FC = () => {
  const api = useApi();

  // State
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<PendingAsset | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'stats' | 'history'>('pending');

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pendingRes, statsRes] = await Promise.all([
        api.get('/asset-review/pending'),
        api.get('/asset-review/dashboard/stats')
      ]);

      setPendingAssets(pendingRes.data || []);
      setStats(statsRes.data || null);
    } catch (error) {
      console.error('Failed to load review data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Submit single asset review
  const handleSubmitReview = async (
    asset: PendingAsset,
    decision: string,
    feedback: string
  ) => {
    if (!reviewerEmail) {
      alert('Please enter your email');
      return;
    }

    try {
      const response = await api.post('/asset-review/submit', {
        asset_id: asset.asset_id,
        overall_decision: decision,
        cultural_feedback: feedback,
        reviewed_by: reviewerEmail,
        confidence: 0.85,
        overrides: []
      });

      if (response.data?.success) {
        alert(`✅ Review submitted for ${asset.asset_id}`);
        setSelectedAsset(null);
        loadData(); // Reload list
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review');
    }
  };

  // Submit bulk review
  const handleBulkReview = async (decision: string) => {
    if (selectedAssets.size === 0) {
      alert('Please select at least one asset');
      return;
    }

    if (!reviewerEmail) {
      alert('Please enter your email');
      return;
    }

    try {
      const response = await api.post('/asset-review/bulk-submit', {
        asset_ids: Array.from(selectedAssets),
        bulk_decision: decision,
        reason: `Bulk ${decision} by ${reviewerEmail}`,
        reviewed_by: reviewerEmail
      });

      if (response.data?.success) {
        alert(`✅ Bulk review submitted for ${selectedAssets.size} assets`);
        setSelectedAssets(new Set());
        loadData();
      }
    } catch (error) {
      console.error('Failed to submit bulk review:', error);
      alert('Failed to submit bulk review');
    }
  };

  const toggleAssetSelection = (assetId: string) => {
    const newSelected = new Set(selectedAssets);
    if (newSelected.has(assetId)) {
      newSelected.delete(assetId);
    } else {
      newSelected.add(assetId);
    }
    setSelectedAssets(newSelected);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'conditional-approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'needs-review':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8">⏳ Loading review data...</div>;
  }

  return (
    <div className="kr-review-dashboard p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            🔍 kr-solidarity Asset Review Dashboard
          </h1>
          <p className="text-slate-600">
            Human review workflow for political/cultural asset governance
          </p>
        </header>

        {/* Reviewer Email Input */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-semibold mb-2">Reviewer Identity</label>
          <input
            type="email"
            placeholder="your-email@example.com"
            value={reviewerEmail}
            onChange={(e) => setReviewerEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-2 font-semibold ${
              tab === 'pending'
                ? 'text-sky-600 border-b-2 border-sky-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            📋 Pending ({pendingAssets.length})
          </button>
          <button
            onClick={() => setTab('stats')}
            className={`px-4 py-2 font-semibold ${
              tab === 'stats'
                ? 'text-sky-600 border-b-2 border-sky-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            📊 Statistics
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-4 py-2 font-semibold ${
              tab === 'history'
                ? 'text-sky-600 border-b-2 border-sky-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            📤 Export
          </button>
        </div>

        {/* Pending Assets Tab */}
        {tab === 'pending' && (
          <div>
            {/* Bulk Actions */}
            {selectedAssets.size > 0 && (
              <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="mb-3 font-semibold text-blue-900">
                  {selectedAssets.size} assets selected
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkReview('approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    ✅ Bulk Approve
                  </button>
                  <button
                    onClick={() => handleBulkReview('conditional-approval')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    ⚠️ Bulk Conditional
                  </button>
                  <button
                    onClick={() => handleBulkReview('rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    ❌ Bulk Reject
                  </button>
                  <button
                    onClick={() => setSelectedAssets(new Set())}
                    className="px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Asset List */}
            <div className="space-y-4">
              {pendingAssets.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-lg border border-slate-200">
                  <p className="text-slate-500 text-lg">✅ No pending assets for review</p>
                </div>
              ) : (
                pendingAssets.map((asset) => (
                  <AssetReviewCard
                    key={asset.asset_id}
                    asset={asset}
                    isSelected={selectedAssets.has(asset.asset_id)}
                    onToggleSelect={() => toggleAssetSelection(asset.asset_id)}
                    onViewDetails={() => setSelectedAsset(asset)}
                    getStatusColor={getStatusColor}
                  />
                ))
              )}
            </div>

            {/* Detail View Modal */}
            {selectedAsset && (
              <AssetReviewModal
                asset={selectedAsset}
                reviewerEmail={reviewerEmail}
                onClose={() => setSelectedAsset(null)}
                onSubmit={handleSubmitReview}
              />
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {tab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              label="Pending Review"
              value={stats.total_assets_pending}
              icon="📋"
              color="bg-blue-100"
            />
            <StatCard
              label="Approved"
              value={stats.assets_approved}
              icon="✅"
              color="bg-green-100"
            />
            <StatCard
              label="Rejected"
              value={stats.assets_rejected}
              icon="❌"
              color="bg-red-100"
            />
            <StatCard
              label="Conditional"
              value={stats.assets_conditional}
              icon="⚠️"
              color="bg-yellow-100"
            />
            <StatCard
              label="Avg Review Time (min)"
              value={stats.average_review_time.toFixed(1)}
              icon="⏱️"
              color="bg-purple-100"
            />
            <StatCard
              label="Pending Overrides"
              value={stats.pending_overrides}
              icon="⚖️"
              color="bg-orange-100"
            />
          </div>
        )}

        {/* Export Tab */}
        {tab === 'history' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">📤 Export Reviews</h3>
            <div className="space-y-4">
              <button
                onClick={() => alert('Export feature: Download all reviews as JSON')}
                className="w-full px-4 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-left"
              >
                📄 Export All Reviews (JSON)
              </button>
              <button
                onClick={() => alert('Export feature: Download all reviews as CSV')}
                className="w-full px-4 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-left"
              >
                📊 Export All Reviews (CSV)
              </button>
              <button
                onClick={() => alert('Approval report will show asset approval timeline')}
                className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-left"
              >
                📈 Approval Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


/**
 * Asset Review Card Component
 */
interface AssetReviewCardProps {
  asset: PendingAsset;
  isSelected: boolean;
  onToggleSelect: () => void;
  onViewDetails: () => void;
  getStatusColor: (status: string) => string;
}

const AssetReviewCard: React.FC<AssetReviewCardProps> = ({
  asset,
  isSelected,
  onToggleSelect,
  onViewDetails,
  getStatusColor,
}) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isSelected ? 'border-sky-600 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="mt-1 w-5 h-5 cursor-pointer"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-slate-900">{asset.name}</h3>
              <p className="text-sm text-slate-600">{asset.asset_id}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(asset.approval_status)}`}>
                {asset.approval_status}
              </span>
              <span className="px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                {asset.category}
              </span>
            </div>
          </div>

          <div className="mb-3 flex gap-4 text-sm text-slate-600">
            <span>📊 Score: {asset.score.toFixed(1)}/100</span>
            <span>🎯 {asset.political_significance}</span>
            {asset.text_content && <span>📝 Text: "{asset.text_content}"</span>}
          </div>

          {/* Violations/Warnings */}
          {(asset.violations.length > 0 || asset.warnings.length > 0) && (
            <div className="mb-3 space-y-1">
              {asset.violations.map((v, i) => (
                <p key={i} className="text-sm text-red-700">
                  ❌ {v}
                </p>
              ))}
              {asset.warnings.map((w, i) => (
                <p key={i} className="text-sm text-yellow-700">
                  ⚠️ {w}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onViewDetails}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 whitespace-nowrap"
        >
          Review
        </button>
      </div>
    </div>
  );
};


/**
 * Asset Review Modal Component
 */
interface AssetReviewModalProps {
  asset: PendingAsset;
  reviewerEmail: string;
  onClose: () => void;
  onSubmit: (asset: PendingAsset, decision: string, feedback: string) => void;
}

const AssetReviewModal: React.FC<AssetReviewModalProps> = ({
  asset,
  reviewerEmail,
  onClose,
  onSubmit,
}) => {
  const [decision, setDecision] = useState('conditional-approval');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!feedback.trim()) {
      alert('Please provide feedback');
      return;
    }
    onSubmit(asset, decision, feedback);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">
            Review: {asset.name} ({asset.asset_id})
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Asset Details */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Asset Details</h3>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Category</p>
                <p className="font-semibold text-slate-900">{asset.category}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Score</p>
                <p className="font-semibold text-slate-900">{asset.score.toFixed(1)}/100</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Political Significance</p>
                <p className="font-semibold text-slate-900">{asset.political_significance}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Governance Status</p>
                <p className="font-semibold text-slate-900">
                  {asset.governance_passed ? '✅ Passed' : '❌ Failed'}
                </p>
              </div>
            </div>
          </div>

          {/* Issues */}
          {(asset.violations.length > 0 || asset.warnings.length > 0) && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Issues to Address</h3>
              <div className="space-y-2 bg-red-50 p-4 rounded-lg border border-red-200">
                {asset.violations.map((v, i) => (
                  <p key={i} className="text-sm text-red-700">
                    ❌ <strong>VIOLATION:</strong> {v}
                  </p>
                ))}
                {asset.warnings.map((w, i) => (
                  <p key={i} className="text-sm text-yellow-700">
                    ⚠️ <strong>WARNING:</strong> {w}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Decision */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Your Decision</h3>
            <div className="space-y-2">
              {['approved', 'conditional-approval', 'needs-revision', 'rejected'].map((d) => (
                <label key={d} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="decision"
                    value={d}
                    checked={decision === d}
                    onChange={(e) => setDecision(e.target.value)}
                    className="mr-3"
                  />
                  <span className="font-semibold text-slate-900 capitalize">
                    {d === 'conditional-approval'
                      ? 'Conditional Approval'
                      : d === 'needs-revision'
                        ? 'Needs Revision'
                        : d.charAt(0).toUpperCase() + d.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Cultural Feedback & Justification
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide your review feedback, considering cultural sensitivity, political representation, and aesthetic quality..."
              rows={5}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};


/**
 * Statistics Card Component
 */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  return (
    <div className={`${color} p-6 rounded-lg`}>
      <p className="text-3xl mb-2">{icon}</p>
      <p className="text-sm text-slate-600 font-semibold">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default AssetReviewDashboard;
