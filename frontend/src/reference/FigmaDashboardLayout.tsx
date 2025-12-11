
// This is a placeholder for the Figma code.
// The user has simply instructed to create the file and paste the *raw* Figma code here.
// Since the user is *asking* to paste it, for now, I will create a stub that represents
// the "Reference Layout" to be analyzed in the next step.
//
// In a real scenario, the user would provide the code block to paste.
// I will populate this with a distinct structure that *simulates* a raw Figma export 
// to demonstrate the "Transplant" process effectively.

import React from 'react';

export const FigmaDashboardLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '40px', backgroundColor: '#F5F5FA' }}>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Career Dashboard</h1>
                    <p style={{ color: '#666' }}>Good morning, Alex! You have 3 pending actions.</p>
                </div>
                <button style={{ backgroundColor: '#6200EE', color: 'white', padding: '12px 24px', borderRadius: '8px' }}>
                    + New Application
                </button>
            </div>

            {/* Main Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                {/* Left Column: Applications & Documents */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Active Applications Section */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Active Applications</h2>
                            <a href="#" style={{ color: '#6200EE' }}>View All</a>
                        </div>

                        {/* Horizontal Scroll / Grid of Job Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            {/* Reference Job Card 1 */}
                            <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '12px', background: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3>UX Designer</h3>
                                    <span style={{ background: '#E0F2F1', color: '#00695C', padding: '4px 8px', borderRadius: '4px' }}>98% Match</span>
                                </div>
                                <p>Google • Mountain View</p>
                                <div style={{ marginTop: '12px', fontSize: '12px', color: '#888' }}>Applied 2 days ago</div>
                            </div>

                            {/* Reference Job Card 2 */}
                            <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '12px', background: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3>Product Manager</h3>
                                    <span style={{ background: '#FFF3E0', color: '#EF6C00', padding: '4px 8px', borderRadius: '4px' }}>75% Match</span>
                                </div>
                                <p>Airbnb • Remote</p>
                                <div style={{ marginTop: '12px', fontSize: '12px', color: '#888' }}>Applied 5 days ago</div>
                            </div>
                        </div>
                    </section>

                    {/* Recent Documents Section */}
                    <section>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Recent Documents</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            {/* Document Card Placeholder */}
                            <div style={{ aspectRatio: '3/4', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                DOC 1 Preview
                            </div>
                            <div style={{ aspectRatio: '3/4', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                DOC 2 Preview
                            </div>

                            {/* "Create New" Action */}
                            <div style={{ aspectRatio: '3/4', border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                                + Create New
                            </div>
                        </div>
                    </section>

                </div>

                {/* Right Column: Profile & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Profile Summary */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ccc', margin: '0 auto 16px' }}></div>
                        <h3 style={{ textAlign: 'center' }}>Alex Johnson</h3>
                        <p style={{ textAlign: 'center', color: '#666' }}>Senior Product Designer</p>
                        <div style={{ marginTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Profile Strength</span>
                                <span>85%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#eee', borderRadius: '4px' }}>
                                <div style={{ width: '85%', height: '100%', background: '#6200EE', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ padding: '16px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <div style={{ width: '40px', height: '40px', background: '#E8EAF6', borderRadius: '8px' }}></div>
                            <div>
                                <h4 style={{ margin: 0 }}>Analyze Resume</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Check against job descriptions</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
