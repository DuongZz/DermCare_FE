import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  Icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, change, isPositive, Icon, color }: StatCardProps) => {
  return (
    <div className="stat-card glass-card">
      <div className="card-top">
        <div className="icon-box" style={{ background: `${color}15`, color: color }}>
          <Icon size={24} />
        </div>
        <div className={`change-badge ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {change}
        </div>
      </div>
      <div className="card-bottom">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
      </div>

      <style jsx>{`
        .stat-card {
          padding: 24px;
          flex: 1;
          min-width: 240px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: transform 0.3s;
        }
        .stat-card:hover {
          transform: translateY(-5px);
        }
        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .change-badge {
          font-size: 13px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 99px;
        }
        .positive {
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
        }
        .negative {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }
        .card-title {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 4px;
        }
        .card-value {
          font-size: 28px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default StatCard;
