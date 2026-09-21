// src/App.tsx
import { useState, useEffect } from 'react';
import type { TreasuryView } from './types/navigation';
import type { PropertyAccount } from './types/treasury';
import { treasuryApi } from './services/treasuryApi';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/TopBar';
import { PropertySearchView } from './pages/PropertySearchView';
import { TreasuryDashboard } from './pages/TreasuryDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<TreasuryView>('search');
  const [propertiesList, setPropertiesList] = useState<PropertyAccount[]>([]);
  const [selectedPinForSOA, setSelectedPinForSOA] = useState<string>('002-0021');

  useEffect(() => {
    treasuryApi.searchProperties('', 0, 50)
      .then((res) => {
        if (res?.content && res.content.length > 0) {
          setPropertiesList(res.content);
        } else {

          setPropertiesList([
            {
              id: 1,
              pin: '002-0021',
              taxDeclarationNo: 'TD-2025-00101',
              ownerName: 'DELA CRUZ, MARIA L.',
              location: 'Brgy. San Isidro (Lot 7, Blk 2)',
              kind: 'LA',
              taxability: 'TAXABLE',
              currentAssessedValue: 240000.0,
            },
            {
              id: 2,
              pin: '002-040',
              taxDeclarationNo: 'TD-2026-00451',
              ownerName: 'TIMONER Y RAMOS, LOURDES C.',
              location: 'Brgy. Binanuaan (Lot 14, Cad-291-D)',
              kind: 'LA',
              taxability: 'TAXABLE',
              currentAssessedValue: 192000.0,
            },
          ]);
        }
      })
      .catch(() => {
        setPropertiesList([
          {
            id: 1,
            pin: '002-0021',
            taxDeclarationNo: 'TD-2025-00101',
            ownerName: 'DELA CRUZ, MARIA L.',
            location: 'Brgy. San Isidro (Lot 7, Blk 2)',
            kind: 'LA',
            taxability: 'TAXABLE',
            currentAssessedValue: 240000.0,
          },
        ]);
      });
  }, []);

  const handleOpenInSOA = (pin: string) => {
    setSelectedPinForSOA(pin);
    setCurrentView('statement');
  };

  return (
    <div className="app">
      <Sidebar currentView={currentView} onSelectView={setCurrentView} />

      <div className="main">
        <Topbar
          title={
            currentView === 'search'
              ? 'Property & Taxpayer Search'
              : currentView === 'statement'
                ? 'Statement of Account'
                : 'Dashboard'
          }
          subtitle={
            currentView === 'search'
              ? 'Search PIN, owner, and assessment records'
              : 'Request form and automated tax computation'
          }
        />

        {currentView === 'search' && (
          <PropertySearchView
            properties={propertiesList}
            onOpenInSOA={handleOpenInSOA}
          />
        )}

        {currentView === 'statement' && (
          <TreasuryDashboard initialPin={selectedPinForSOA} />
        )}
      </div>
    </div>
  );
}