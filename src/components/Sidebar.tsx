'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar({ onToggleSidebar, isOpen }: { onToggleSidebar: () => void, isOpen: boolean }) {

  const menuItems = [
    { name: 'Text Generation', path: '/text-generation' },
    { name: 'Images and Vision', path: '/images-vision' },
    { name: 'Audio and Speech', path: '/audio-speech' },
    { name: 'Structured Output', path: '/structured-output' },
  ];

  return (
    <>
      {/* Toggle button - Always visible */}
      <button
        onClick={onToggleSidebar}
        className={`fixed top-4 z-50 p-2 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition-all duration-300 ${
          isOpen ? 'left-60' : 'left-4'
        }`}
      >
        {isOpen ? '←' : '→'}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-neutral-900 border-r border-neutral-700
          text-neutral-200 transition-all duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
        `}
      >
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-1 text-white">
            OpenAI API
          </h1>
          <p className="text-sm text-neutral-400 mb-8">Dashboard</p>

          <nav>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="block px-4 py-2.5 text-sm rounded hover:bg-neutral-800 
                             transition-colors duration-150 border-l-2 border-transparent hover:border-neutral-500"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-800">
          <p className="text-xs text-neutral-500">
            Powered by OpenAI
          </p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}
    </>
  );
}
