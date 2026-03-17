'use client';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { Users as UserIcon, Stethoscope, Calendar, Activity } from 'lucide-react';

const usersData = [
  { id: 1, name: 'Alerisan Anner', email: 'alerisan@defense.local', role: 'Team Member', status: 'Active', activeDate: '3/1/2026' },
  { id: 5, name: 'Corey Lim', email: 'corey@defense.local', role: 'Analyst', status: 'Active', activeDate: '2/28/2026' },
  { id: 2, name: 'Jaarm Demer', email: 'jaarm@defense.local', role: 'Team Member', status: 'Active', activeDate: '3/2/2026' },
];

const userColumns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Name', accessor: 'name' },
  { header: 'Status', accessor: 'status' },
];

export default function Dashboard() {
  return (
    <main className="dashboard-layout">
      <Sidebar />
      
      <div className="main-content">
        <Header title="Dashboard Overview" />
        
        <div className="content-inner">
          <div className="stats-grid">
            <StatCard 
              title="Total Users" 
              value="1,284" 
              change="12.5%" 
              isPositive={true} 
              Icon={UserIcon} 
              color="#3b82f6" 
            />
            <StatCard 
              title="Doctors" 
              value="42" 
              change="2.4%" 
              isPositive={true} 
              Icon={Stethoscope} 
              color="#8b5cf6" 
            />
            <StatCard 
              title="Appointments" 
              value="352" 
              change="5.2%" 
              isPositive={false} 
              Icon={Calendar} 
              color="#ec4899" 
            />
            <StatCard 
              title="Engagement" 
              value="84%" 
              change="8.1%" 
              isPositive={true} 
              Icon={Activity} 
              color="#10b981" 
            />
          </div>

          <div className="page-section">
            <DataTable 
              title="Recent Users"
              columns={userColumns}
              data={usersData}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          max-width: 100vw;
          overflow-x: hidden;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: calc(100vw - var(--sidebar-width));
        }
        .content-inner {
          padding: 0 12px 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          padding: 20px;
        }
        .page-section {
          width: 100%;
        }
      `}</style>
    </main>
  );
}
