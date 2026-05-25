import React from 'react';

const Navbar: React.FC = () => {
  const navItems = ['Upload', 'Dashboard', 'History', 'Reports'];

  return (
    <nav className="flex justify-between items-center py-5 border-b border-gray-800/60">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg tracking-wide text-white">
          Asphalt <span className="text-amber-500">Intelligence</span>
        </span>
      </div>

      {/* Navigation Links */}
      {/* <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className={`${
              item === 'Upload' 
                ? 'text-amber-500 border-b-2 border-amber-500 pb-1' 
                : 'text-gray-400 hover:text-white'
            } transition duration-200`}
          >
            {item}
          </a>
        ))}
      </div> */}

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white p-1 rounded-full relative">
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>
        <button className="text-gray-400 hover:text-white p-1 rounded-full">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0" /></svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 border border-gray-700 cursor-pointer"></div>
      </div>
    </nav>
  );
};

export default Navbar;