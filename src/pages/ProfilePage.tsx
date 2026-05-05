import { mockUser } from '../data/mockData';
import { User, MapPin, CreditCard, Lock, Bell, ChevronRight, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const sections = [
    { icon: User, label: 'Account Information', path: '/profile/account' },
    { icon: MapPin, label: 'Addresses', path: '/profile/addresses' },
    { icon: CreditCard, label: 'Payment Methods', path: '/profile/payment' },
    { icon: Lock, label: 'Change Password', path: '/profile/password' },
    { icon: Bell, label: 'Notification Settings', path: '/profile/notifications' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-slate-800">My Profile</h1>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800">Profile</span>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <User size={120} />
        </div>
        
        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary-50 shadow-xl relative group-hover:scale-105 transition-transform duration-500">
          <img 
            src={mockUser.image} 
            alt={mockUser.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Edit3 className="text-white" size={24} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <h2 className="text-3xl font-display font-bold text-slate-800">{mockUser.name}</h2>
          <p className="text-slate-500 font-medium mb-1">{mockUser.email}</p>
          <p className="text-slate-500">{mockUser.phone}</p>
        </div>

        <button className="bg-slate-50 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-bold border border-slate-200 hover:bg-white hover:shadow-md transition-all">
          Edit Profile
        </button>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
        <div className="divide-y divide-slate-50">
          {sections.map((section, idx) => (
            <button
              key={idx}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                  <section.icon size={20} />
                </div>
                <span className="font-bold text-slate-700">{section.label}</span>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" size={20} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
