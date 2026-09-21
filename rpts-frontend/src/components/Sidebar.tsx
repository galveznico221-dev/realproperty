// src/components/Sidebar.tsx
import React from 'react';
import type { TreasuryView } from '../types/navigation';

interface SidebarProps {
    currentView: TreasuryView;
    onSelectView: (view: TreasuryView) => void;
}

const Icons = {
    Dashboard: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
    ),
    Search: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    Statement: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="var(--gold-2)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 21V4h6a5 5 0 0 1 0 10H7" />
            <path d="M5 8h10" />
            <path d="M5 11h10" />
        </svg>
    ),
    Collections: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h20M6 14h2" />
        </svg>
    ),
    Reports: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    AuditTrail: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    ),
    UiFlow: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="4" width="6" height="6" rx="1" />
            <rect x="15" y="14" width="6" height="6" rx="1" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h4a3 3 0 013 3v4m0 0l-2-2m2 2l2-2" />
        </svg>
    )
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
    return (
        <aside className="sidebar" id="sidebar">
            <div>
                <div className="sidebar__brand">
                    <div className="seal seal--sm" aria-hidden="true">LGU</div>
                    <div>
                        <b>RPT System</b>
                        <span>Talisay, Cam. Norte</span>
                    </div>
                </div>

                <div className="sidebar__office">
                    <span className="dot"></span>
                    <span>Treasurer's Office</span>
                </div>

                <nav className="nav" id="nav">
                    <button
                        type="button"
                        className={`nav__item ${currentView === 'dashboard' ? 'is-active' : ''}`}
                        onClick={() => onSelectView('dashboard')}
                    >
                        <span className="nav__ico"><Icons.Dashboard /></span> Dashboard
                    </button>

                    <button
                        type="button"
                        className={`nav__item ${currentView === 'search' ? 'is-active' : ''}`}
                        onClick={() => onSelectView('search')}
                    >
                        <span className="nav__ico"><Icons.Search /></span> Property &amp; Taxpayer Search
                    </button>

                    <button
                        type="button"
                        className={`nav__item ${currentView === 'statement' ? 'is-active' : ''}`}
                        onClick={() => onSelectView('statement')}
                    >
                        <span className="nav__ico"><Icons.Statement /></span> Statement of Account
                    </button>

                    <button
                        type="button"
                        className={`nav__item ${currentView === 'collections' ? 'is-active' : ''}`}
                        onClick={() => onSelectView('collections')}
                    >
                        <span className="nav__ico"><Icons.Collections /></span> Collections
                    </button>

                    <button
                        type="button"
                        className={`nav__item ${currentView === 'reports' ? 'is-active' : ''}`}
                        onClick={() => onSelectView('reports')}
                    >
                        <span className="nav__ico"><Icons.Reports /></span> Reports
                    </button>

                    <button
                        type="button"
                        className={`nav__item ${currentView === 'audit' ? 'is-active' : ''}`}
                        onClick={() => onSelectView('audit')}
                    >
                        <span className="nav__ico"><Icons.AuditTrail /></span> Audit Trail
                    </button>

                    <button
                        type="button"
                        className={`nav__item ${currentView === 'uiflow' ? 'is-active' : ''}`}
                        onClick={() => onSelectView('uiflow')}
                    >
                        <span className="nav__ico"><Icons.UiFlow /></span> UI Flow
                    </button>
                </nav>
            </div>

            <div className="sidebar__foot">
                Assessment data is <b>read-only</b> — maintained by the Assessor's Office.
            </div>
        </aside>
    );
};