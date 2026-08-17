import { useEffect } from "react";
import { X, Phone, MapPin, Mail } from "lucide-react";
import { openWhatsApp } from "../config";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Home", icon: "🏠" },
  { label: "Consultation Services", icon: "👨‍⚕️" },
  { label: "Home Services", icon: "🏡" },
  { label: "Order Medicines", icon: "💊", action: "Hello Pharmos, I want to order medicines." },
  { label: "Doctor Consultation", icon: "📅", action: "Hello Pharmos, I want to book a doctor consultation." },
  { label: "Membership", icon: "📦", url: "https://membership.pharmos.in" },
  { label: "Support", icon: "🎧", action: "Hello Pharmos, I need support." },
];

export default function SideMenu({ open, onClose }: SideMenuProps) {
 useEffect(() => {
  if (open) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [open]); return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white overflow-y-auto shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#0A6E9C] px-5 pt-10 pb-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
          <div className="flex items-center">
            <img
              src="\logo pharmos blue.jpeg"
              alt="PHARMOS"
              className="h-20 w-auto object-contain"
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-3 overflow-y-auto flex-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.url) window.open(item.url, "_blank");
                if (item.action) openWhatsApp(item.action);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50 transition-colors text-left"
            >
              <span className="text-xl w-6 text-center">{item.icon}</span>
              <span className="text-gray-700 font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-100 p-5 space-y-2.5">
          <button
            onClick={() => openWhatsApp("Hello Pharmos, I need assistance.")}
            className="flex items-center gap-3 text-gray-600 hover:text-[#0A6E9C] transition-colors w-full"
          >
            <Phone size={16} className="text-[#0A6E9C] flex-shrink-0" />
            <span className="text-xs">+91 9993446609</span>
          </button>
          <a
            href="https://www.google.com/maps/search/?api=1&query=PHARMOS+Iris+Park+Talawali+Chanda+Indore+Madhya+Pradesh+453771"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 text-gray-600 hover:text-[#0A6E9C] transition-colors"
          >
            <MapPin size={16} className="text-[#0A6E9C] flex-shrink-0 mt-0.5" />
            <span className="text-xs leading-relaxed">PHARMOS, Iris Park, Talawali Chanda, Indore, MP 453771</span>
          </a>
          <div className="flex items-center gap-3 text-gray-600">
            <Mail size={16} className="text-[#0A6E9C] flex-shrink-0" />
            <span className="text-xs">pharmosofficial@gmail.com</span>
          </div>
        </div>
      </div>
    </>
  );
}
