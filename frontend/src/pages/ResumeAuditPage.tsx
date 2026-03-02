import React from 'react';
import { ResumeAuditor } from '../components/resume/ResumeAuditor';
import { AuditResults } from '../components/resume/AuditResults';

export const ResumeAuditPage: React.FC = () => {
    return (
        <div className="container mx-auto px-lg py-xl min-h-screen bg-asphalt-black text-concrete-grey-lightest">
            <header className="mb-xl text-center">
                <h1 className="text-display-kr-dark text-4xl mb-md">Resume Knowledge Library</h1>
                <p className="text-body-medium text-concrete-grey-light max-w-2xl mx-auto">
                    Professional Australian resume auditing powered by Gemini 3.1 Pro. 
                    Align your career profile with industry-standard rules for ATS and human readability.
                </p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg items-start">
                <section>
                    <ResumeAuditor />
                </section>
                <section>
                    <AuditResults />
                </section>
            </div>
            
            <footer className="mt-24 pt-lg border-t border-concrete-grey-dark text-center text-xs text-concrete-grey-dark">
                CareerCopilot RKL Engine v2.0 • Kerala-Rage Design System • Powered by Google Gemini 3.1 Pro
            </footer>
        </div>
    );
};
