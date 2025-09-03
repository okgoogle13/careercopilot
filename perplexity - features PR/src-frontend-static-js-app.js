// CareerCopilot Personal Edition JavaScript

// Global state
let currentTab = 'dashboard';
let isLoading = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('CareerCopilot Personal Edition loaded');
    initializeApp();
});

function initializeApp() {
    // Set initial tab
    showTab('dashboard');

    // Load initial data
    loadDashboardData();

    // Set up periodic updates
    setInterval(checkForUpdates, 300000); // Check every 5 minutes
}

// Tab Management
function showTab(tabName) {
    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Set active nav tab
    const selectedNavTab = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedNavTab) {
        selectedNavTab.classList.add('active');
    }

    currentTab = tabName;

    // Load data for specific tabs
    if (tabName === 'jobs') {
        loadJobsData();
    } else if (tabName === 'applications') {
        loadApplicationsData();
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();

        if (data.status === 'success') {
            updateDashboardUI(data.data);
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function updateDashboardUI(data) {
    // Update stats
    const statsElements = document.querySelectorAll('.stat-number');
    if (statsElements.length >= 2) {
        statsElements[0].textContent = data.activity?.applications_this_week || '0';
        statsElements[1].textContent = '15%'; // Response rate - would come from data
    }

    // Update automation status
    const automationStatus = document.querySelector('.automation-status');
    if (automationStatus && data.automation) {
        const dailyScanStatus = automationStatus.querySelector('.status-value');
        if (dailyScanStatus) {
            dailyScanStatus.textContent = data.automation.daily_scan ? '✅ Enabled' : '❌ Disabled';
            dailyScanStatus.className = `status-value ${data.automation.daily_scan ? 'enabled' : 'disabled'}`;
        }
    }
}

// Job Discovery Functions
async function triggerDailyScan() {
    if (isLoading) return;

    showLoading('Scanning job boards for new opportunities...');

    try {
        const response = await fetch('/api/daily-scan', {
            method: 'POST'
        });

        const result = await response.json();

        if (response.ok) {
            showToast('Daily job scan started! You\'ll receive an email summary shortly.', 'success');

            // Refresh jobs data after a delay
            setTimeout(() => {
                if (currentTab === 'jobs') {
                    loadJobsData();
                }
            }, 5000);
        } else {
            showToast('Failed to start job scan: ' + result.detail, 'error');
        }
    } catch (error) {
        console.error('Daily scan error:', error);
        showToast('Failed to start job scan. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

async function loadJobsData() {
    try {
        // For now, show static data
        // In a real implementation, this would fetch from /api/jobs
        const jobsList = document.getElementById('jobs-list');
        if (jobsList) {
            // Jobs would be loaded here
            console.log('Loading jobs data...');
        }
    } catch (error) {
        console.error('Failed to load jobs data:', error);
    }
}

async function applyToJob(jobUrl) {
    if (isLoading) return;

    showLoading('Preparing your application materials...');

    try {
        const response = await fetch('/api/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                job_url: jobUrl,
                custom_message: null
            })
        });

        const result = await response.json();

        if (response.ok) {
            showToast('Application preparation started! Check your email for materials.', 'success');
        } else {
            showToast('Failed to prepare application: ' + result.detail, 'error');
        }
    } catch (error) {
        console.error('Application error:', error);
        showToast('Failed to prepare application. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Company Research Functions
async function researchCompany(jobUrl) {
    if (isLoading) return;

    showLoading('Researching company information...');

    try {
        const response = await fetch('/api/research', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                job_url: jobUrl
            })
        });

        const result = await response.json();

        if (response.ok) {
            displayResearchResults(result.data);
            showTab('research');
            showToast('Company research completed!', 'success');
        } else {
            showToast('Failed to research company: ' + result.detail, 'error');
        }
    } catch (error) {
        console.error('Research error:', error);
        showToast('Failed to research company. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

function researchCompanyFromForm() {
    const jobUrlInput = document.getElementById('job-url');
    const jobUrl = jobUrlInput.value.trim();

    if (!jobUrl) {
        showToast('Please enter a job URL', 'error');
        return;
    }

    if (!isValidUrl(jobUrl)) {
        showToast('Please enter a valid URL', 'error');
        return;
    }

    researchCompany(jobUrl);
}

function displayResearchResults(researchData) {
    const resultsContainer = document.getElementById('research-results');

    if (!resultsContainer || !researchData) return;

    const html = `
        <div class="research-content">
            <h3>🏢 ${researchData.company}</h3>

            <div class="research-section">
                <h4>💬 Key Talking Points</h4>
                <div class="talking-points">
                    ${researchData.talking_points || 'Research in progress...'}
                </div>
            </div>

            <div class="research-section">
                <h4>🎯 Application Strategy</h4>
                <div class="application-strategy">
                    ${researchData.application_strategy || 'Strategy being generated...'}
                </div>
            </div>

            <div class="research-actions">
                <button class="btn btn-primary" onclick="applyToJob('${researchData.job_url}')">
                    📄 Prepare Application
                </button>
            </div>
        </div>
    `;

    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
}

// Application Tracking Functions
async function loadApplicationsData() {
    try {
        const response = await fetch('/api/applications?limit=20');
        const data = await response.json();

        if (data.status === 'success') {
            displayApplications(data.data);
        }
    } catch (error) {
        console.error('Failed to load applications:', error);
    }
}

function displayApplications(applications) {
    const applicationsList = document.getElementById('applications-list');

    if (!applicationsList) return;

    if (applications.length === 0) {
        applicationsList.innerHTML = `
            <div class="empty-state">
                <p>No applications yet. Start by discovering jobs and applying!</p>
                <button class="btn btn-primary" onclick="showTab('jobs')">Discover Jobs</button>
            </div>
        `;
        return;
    }

    const html = applications.map(app => `
        <div class="application-card">
            <div class="application-header">
                <h4>${app.job_title}</h4>
                <span class="status-badge status-${app.status}">${formatStatus(app.status)}</span>
            </div>
            <p class="application-company">${app.company}</p>
            <p class="application-date">Applied: ${formatDate(app.applied_date)}</p>
            <div class="application-actions">
                <button class="btn btn-small btn-secondary" onclick="viewApplicationMaterials('${app.id}')">
                    View Materials
                </button>
                <button class="btn btn-small btn-secondary" onclick="updateApplicationStatus('${app.id}')">
                    Update Status
                </button>
                <button class="btn btn-small btn-secondary" onclick="setReminder('${app.id}')">
                    Set Reminder
                </button>
            </div>
        </div>
    `).join('');

    applicationsList.innerHTML = html;
}

async function triggerWeeklyReview() {
    if (isLoading) return;

    showLoading('Generating your weekly job search review...');

    try {
        const response = await fetch('/api/weekly-review', {
            method: 'POST'
        });

        const result = await response.json();

        if (response.ok) {
            showToast('Weekly review started! You\'ll receive an email summary shortly.', 'success');
        } else {
            showToast('Failed to start weekly review: ' + result.detail, 'error');
        }
    } catch (error) {
        console.error('Weekly review error:', error);
        showToast('Failed to start weekly review. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Settings Functions
async function saveSettings() {
    if (isLoading) return;

    const dailyScan = document.getElementById('daily-scan').checked;
    const emailNotifications = document.getElementById('email-notifications').checked;
    const targetRolesText = document.getElementById('target-roles').value;
    const targetRoles = targetRolesText.split('\n').map(role => role.trim()).filter(role => role);

    const settings = {
        daily_job_scan: dailyScan,
        email_notifications: emailNotifications,
        target_roles: targetRoles
    };

    showLoading('Saving your settings...');

    try {
        const response = await fetch('/api/config', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });

        const result = await response.json();

        if (response.ok) {
            showToast('Settings saved successfully!', 'success');
        } else {
            showToast('Failed to save settings: ' + result.detail, 'error');
        }
    } catch (error) {
        console.error('Settings save error:', error);
        showToast('Failed to save settings. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Utility Functions
function showLoading(message = 'Processing...') {
    isLoading = true;
    const modal = document.getElementById('loading-modal');
    const messageEl = document.getElementById('loading-message');

    if (messageEl) {
        messageEl.textContent = message;
    }

    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideLoading() {
    isLoading = false;
    const modal = document.getElementById('loading-modal');

    if (modal) {
        modal.style.display = 'none';
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('notification-toast');
    const messageEl = document.getElementById('toast-message');

    if (!toast || !messageEl) return;

    messageEl.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'flex';

    // Auto hide after 5 seconds
    setTimeout(hideToast, 5000);
}

function hideToast() {
    const toast = document.getElementById('notification-toast');

    if (toast) {
        toast.style.display = 'none';
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function formatStatus(status) {
    const statusMap = {
        'applied': 'Applied',
        'under_review': 'Under Review',
        'interview_scheduled': 'Interview Scheduled',
        'interview_completed': 'Interview Completed',
        'offer_received': 'Offer Received',
        'rejected': 'Rejected',
        'withdrawn': 'Withdrawn'
    };

    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

async function checkForUpdates() {
    // Periodically check for updates in the background
    try {
        const response = await fetch('/api/status');
        const data = await response.json();

        if (data.status === 'success' && currentTab === 'dashboard') {
            updateDashboardUI(data.data);
        }
    } catch (error) {
        // Silent failure for background updates
        console.log('Background update failed:', error);
    }
}

// Placeholder functions for features to be implemented
function viewApplicationMaterials(applicationId) {
    showToast('Application materials viewer coming soon!', 'info');
}

function updateApplicationStatus(applicationId) {
    showToast('Status update feature coming soon!', 'info');
}

function setReminder(applicationId) {
    showToast('Reminder feature coming soon!', 'info');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + 1-5 for tab switching
    if ((event.ctrlKey || event.metaKey) && event.key >= '1' && event.key <= '5') {
        event.preventDefault();
        const tabs = ['dashboard', 'jobs', 'applications', 'research', 'settings'];
        const tabIndex = parseInt(event.key) - 1;

        if (tabs[tabIndex]) {
            showTab(tabs[tabIndex]);
        }
    }

    // Escape key to close modals
    if (event.key === 'Escape') {
        hideLoading();
        hideToast();
    }
});

console.log('CareerCopilot Personal Edition JavaScript loaded successfully!');
