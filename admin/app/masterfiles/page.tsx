'use client';

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DataTable from '../../components/DataTable';

const masterfilesData = [
  { id: 10010, name: 'Sealine Delta', owner: 'Fleet', date: '9/23/2024', status: 'Active', budget: '$2.6M' },
  { id: 10009, name: 'Blue Vault', owner: 'Cyber', date: '8/19/2024', status: 'Archived', budget: '$0.7M' },
  { id: 10008, name: 'Node Relay', owner: 'Signals', date: '6/4/2024', status: 'Active', budget: '$0.9M' },
  { id: 10007, name: 'Coastal Lens', owner: 'Surveillance', date: '5/11/2024', status: 'Pending', budget: '$1.2M' },
  { id: 10006, name: 'Air Command 7', owner: 'Air Wing', date: '3/20/2024', status: 'Active', budget: '$2.3M' },
  { id: 10005, name: 'Harbor Shield', owner: 'Logistics', date: '1/13/2024', status: 'Pending', budget: '$1.9M' },
  { id: 10004, name: 'Brgm Name', owner: 'Navy', date: '12/6/2023', status: 'Active', budget: '$3.2M' },
];

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Owner', accessor: 'owner' },
  { header: 'Date', accessor: 'date' },
  { 
    header: 'Status', 
    accessor: 'status',
    render: (row: any) => (
      <span className={`status-badge ${row.status === 'Active' ? 'status-active' : row.status === 'Pending' ? 'status-pending' : 'status-archived'}`}>
        {row.status}
      </span>
    )
  },
  { header: 'Budget', accessor: 'budget' },
];

export default function Masterfiles() {
  return (
    <main className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header title="Masterfiles" />
        <div className="content-inner">
          <DataTable 
            title="Masterfiles"
            columns={columns}
            data={masterfilesData}
            addButtonLabel="Add Record"
            searchPlaceholder="Search masterfiles..."
            onAdd={() => {}}
            onExport={() => {}}
          />
        </div>
      </div>

      <style jsx>{`
        .dashboard-layout { display: flex; min-height: 100vh; }
        .main-content { flex: 1; display: flex; flex-direction: column; }
        .content-inner { padding: 0 12px 32px; }
        .status-badge { padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; }
        .status-active { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
        .status-pending { background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.2); }
        .status-archived { background: rgba(255, 255, 255, 0.1); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); }
      `}</style>
    </main>
  );
}
