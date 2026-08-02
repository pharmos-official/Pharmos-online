import { Home, Grid, ShoppingBag, HeadphonesIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { openWhatsApp } from "../config";

interface BottomNavProps {
  active: string;
  onSelect: (tab: string) => void;
}

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "services", label: "Blogs", icon: Grid },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "support", label: "Support", icon: HeadphonesIcon },
];

export default function BottomNav({ active, onSelect }: BottomNavProps) {
  const navigate = useNavigate();

  const handleTab = (id: string) => {
    onSelect(id);

    if (id === "services") {
      navigate("/blog");
    } else if (id === "support") {
      openWhatsApp("Hello Pharmos, I need support.");
    } else if (id === "orders") {
      openWhatsApp("Hello Pharmos, I want to check my order status.");
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-2xl">
       <div className="max-w-7xl mx-auto flex items-center justify-around px-4 py-2">
         {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className="flex flex-col items-center gap-0.5 py-2 px-3 min-w-[60px]"
            >
              <Icon
                size={22}
                className={`transition-colors ${isActive ? "text-[#0A6E9C]" : "text-gray-400"}`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-[#0A6E9C]" : "text-gray-400"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Center FAB */}
        <button
          onClick={() => openWhatsApp("Hello Pharmos, I want to order medicines.")}
          className="w-14 h-14 rounded-full bg-[#0A6E9C] flex items-center justify-center shadow-xl -mt-5 hover:bg-[#085d85] transition-colors active:scale-95"
          aria-label="Order Medicines"
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
            <path d="M12 4v16M4 12h16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Right tabs */}
        {tabs.slice(2).map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className="flex flex-col items-center gap-0.5 py-2 px-3 min-w-[60px]"
            >
              <Icon
                size={22}
                className={`transition-colors ${isActive ? "text-[#0A6E9C]" : "text-gray-400"}`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-[#0A6E9C]" : "text-gray-400"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
