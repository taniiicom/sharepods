// types/layout.ts
export interface LayoutProps {
  children: React.ReactNode;
}

// components/MobileLayout.tsx
import React from "react";
// import { LayoutProps } from "../types/layout";

const MobileLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-50">
        <div className="flex-1">
          <h1 className="text-lg font-semibold">SharePods</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-16">
        <div className="max-w-lg mx-auto px-4">{children}</div>
      </main>

      {/* Bottom Navigation */}
      {/* <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4">
        <NavButton icon="home" label="ホーム" />
        <NavButton icon="search" label="検索" />
        <NavButton icon="profile" label="プロフィール" />
      </nav> */}
    </div>
  );
};

// interface NavButtonProps {
//   icon: "home" | "search" | "profile";
//   label: string;
// }

// const NavButton: React.FC<NavButtonProps> = ({ icon, label }) => {
//   const getIcon = (type: NavButtonProps["icon"]) => {
//     switch (type) {
//       case "home":
//         return (
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//           />
//         );
//       case "search":
//         return (
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//           />
//         );
//       case "profile":
//         return (
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//           />
//         );
//   }
// };

// return (
//   <button className="flex flex-col items-center" aria-label={label}>
//     <div className="w-6 h-6 text-gray-600">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         {getIcon(icon)}
//       </svg>
//     </div>
//     <span className="text-xs mt-1">{label}</span>
//   </button>
// );
// };

export default MobileLayout;
