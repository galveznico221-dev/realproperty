import React, { useState, useMemo } from 'react';
import type { PropertyAccount } from '../types/treasury';

interface PropertySearchViewProps {
    properties: PropertyAccount[];
    onOpenInSOA: (pin: string) => void;
}

export const PropertySearchView: React.FC<PropertySearchViewProps> = ({
    properties,
    onOpenInSOA,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedKind, setSelectedKind] = useState<string>('');
    const [exemptOnly, setExemptOnly] = useState<boolean>(false);
    const [selectedPin, setSelectedPin] = useState<string>(properties[0]?.pin || '');

    const filteredProperties = useMemo(() => {
        return properties.filter((p) => {
            if (selectedKind && p.kind !== selectedKind) return false;
            if (exemptOnly && p.taxability !== 'EXEMPT') return false;
            if (!searchTerm.trim()) return true;

            const q = searchTerm.toLowerCase();
            const haystack = [p.pin, p.ownerName, p.location || '', p.taxDeclarationNo]
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [properties, searchTerm, selectedKind, exemptOnly]);

    const activeProperty = useMemo(() => {
        return properties.find((p) => p.pin === selectedPin) || properties[0];
    }, [properties, selectedPin]);

    const peso = (n: number) =>
        '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="content">
            {/* Filter Card */}
            <div className="card">
                <div className="filters">
                    <div className="field">
                        <label htmlFor="searchQuery">Search PIN, Tax Declaration, or Taxpayer Name</label>
                        <input
                            id="searchQuery"
                            type="text"
                            className="input"
                            placeholder="e.g. 002-0021, DELA CRUZ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="kindFilter">Property Kind</label>
                        <select
                            id="kindFilter"
                            className="input"
                            value={selectedKind}
                            onChange={(e) => setSelectedKind(e.target.value)}
                        >
                            <option value="">All Kinds</option>
                            <option value="LA">Land (LA)</option>
                            <option value="BL">Building / Improvements (BL)</option>
                            <option value="MC">Machinery (MC)</option>
                        </select>
                    </div>

                    <div className="field" style={{ alignSelf: 'flex-end', paddingBottom: '10px' }}>
                        <label className="check">
                            <input
                                type="checkbox"
                                checked={exemptOnly}
                                onChange={(e) => setExemptOnly(e.target.checked)}
                            />
                            <span>Tax-Exempt Only</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Master-Detail Split Grid */}
            <div className="grid grid--split">
                {/* Left: Master Table */}
                <div className="card">
                    <div className="card__head">
                        <h3>Registered Properties</h3>
                        <span className="step-pill">{filteredProperties.length} records</span>
                    </div>

                    <div className="table-wrap table-wrap--tall">
                        <table className="table table--hover">
                            <thead>
                                <tr>
                                    <th>PIN</th>
                                    <th>Owner Name</th>
                                    <th>Kind</th>
                                    <th className="ta-r">Assessed Value</th>
                                    <th>Taxability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProperties.length > 0 ? (
                                    filteredProperties.map((p) => {
                                        const isSelected = p.pin === selectedPin;
                                        return (
                                            <tr
                                                key={p.pin}
                                                className={isSelected ? 'is-selected' : ''}
                                                onClick={() => setSelectedPin(p.pin)}
                                            >
                                                <td className="mono">{p.pin}</td>
                                                <td>{p.ownerName}</td>
                                                <td>{p.kind}</td>
                                                <td className="ta-r">{peso(p.currentAssessedValue)}</td>
                                                <td>
                                                    <span
                                                        className={`badge ${p.taxability === 'EXEMPT' ? 'badge--exempt' : 'badge--unpaid'
                                                            }`}
                                                    >
                                                        {p.taxability}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="empty">
                                            No property records match your search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Detail Card */}
                <div className="card">
                    <div className="card__head">
                        <h3>Property Assessment Record</h3>
                        <span className="step-pill">Assessor Details</span>
                    </div>

                    {activeProperty ? (
                        <div>
                            <div className="detail">
                                <h4>General Information</h4>
                                <dl className="dl">
                                    <dt>PIN</dt>
                                    <dd className="mono">{activeProperty.pin}</dd>
                                    <dt>Tax Dec No.</dt>
                                    <dd className="mono">{activeProperty.taxDeclarationNo}</dd>
                                    <dt>Declared Owner</dt>
                                    <dd>{activeProperty.ownerName}</dd>
                                    <dt>Location</dt>
                                    <dd>{activeProperty.location || 'Talisay, Camarines Norte'}</dd>
                                    <dt>Classification</dt>
                                    <dd>{activeProperty.kind}</dd>
                                    <dt>Taxability</dt>
                                    <dd>{activeProperty.taxability}</dd>
                                </dl>
                            </div>

                            <div className="detail" style={{ marginTop: '16px' }}>
                                <h4>Assessment Base</h4>
                                <dl className="dl">
                                    <dt>Assessed Value</dt>
                                    <dd>
                                        <b>{peso(activeProperty.currentAssessedValue)}</b>
                                    </dd>
                                    <dt>Base 2% RPT Rate</dt>
                                    <dd>{peso(activeProperty.currentAssessedValue * 0.02)}</dd>
                                </dl>
                            </div>

                            <div className="btn-row" style={{ marginTop: '24px' }}>
                                <button
                                    type="button"
                                    className="btn btn--primary"
                                    onClick={() => onOpenInSOA(activeProperty.pin)}
                                >
                                    Open in SOA Form
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="empty">Select a property record to review details.</div>
                    )}
                </div>
            </div>
        </div>
    );
};