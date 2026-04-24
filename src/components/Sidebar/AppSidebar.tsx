import React from 'react';
import {
  LayoutDashboard,
  Shield,
  Clock,
  BarChart2,
  Plug,
  Database,
  Network,
  Users,
  Inbox,
  MessageSquare,
  Settings,
  HelpCircle
} from 'lucide-react';
import './AppSidebar.css';

const navItems = [
  {
    group: 'General',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', active: true },
      { icon: Shield, label: 'Compliance' },
      { icon: Clock, label: 'Scheduler', badge: '11' },
      { icon: BarChart2, label: 'Analytics' },
    ]
  },
  {
    group: 'Automation',
    items: [
      { icon: Plug, label: 'Integrations' },
      { icon: Database, label: 'Repository', badge: '7' },
      { icon: Network, label: 'Workflows' },
    ]
  },
  {
    group: 'Resources',
    items: [
      { icon: Users, label: 'Member' },
      { icon: Inbox, label: 'Inbox', badge: '13' },
      { icon: MessageSquare, label: 'Messages' },
    ]
  }
];

const AppSidebar: React.FC = () => {
  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-scroll">
        {navItems.map((group) => (
          <div key={group.group} className="sidebar-group">
            <div className="sidebar-group-title">{group.group}</div>
            <div className="sidebar-items">
              {group.items.map((item) => (
                <div key={item.label} className={`sidebar-item ${item.active ? 'active' : ''}`}>
                  <item.icon size={16} />
                  <span>{item.label}</span>
                  {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-item">
          <Settings size={16} />
          <span>Settings</span>
        </div>
        <div className="sidebar-item">
          <HelpCircle size={16} />
          <span>Help & Support</span>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
