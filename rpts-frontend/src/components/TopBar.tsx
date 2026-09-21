// src/components/Topbar.tsx
import React, { useState, useEffect } from 'react';

interface TopbarProps {
    title: string;
    subtitle: string;
}

export const Topbar: React.FC<TopbarProps> = ({ title, subtitle }) => {
    const [clockString, setClockString] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const d = new Date();
            const opts: Intl.DateTimeFormatOptions = {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            };
            setClockString(
                `${d.toLocaleDateString('en-PH', opts)} · ${d.toLocaleTimeString('en-PH', {
                    hour: '2-digit',
                    minute: '2-digit',
                })}`
            );
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="topbar">
            <div className="topbar__left">
                <div>
                    <h1>{title}</h1>
                    <p className="muted small">{subtitle}</p>
                </div>
            </div>
            <div className="topbar__right">
                <div className="clock">{clockString}</div>
                <div className="user">
                    <div className="user__avatar">T</div>
                    <div className="user__meta">
                        <b>Treasurer IT Staff</b>
                        <span className="muted">Treasurer's Office · IT Staff</span>
                    </div>
                    <button className="btn btn--ghost btn--sm" type="button">
                        Sign out
                    </button>
                </div>
            </div>
        </header>
    );
};