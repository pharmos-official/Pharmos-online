import {
  Heart,
  Truck,
  TestTubesIcon,
  HeartHandshake,
} from "lucide-react";
import { openWhatsApp } from "../config";

const services = [
  {
    id: "nursing",
    label: "Nursing\nStaff",
    icon: Heart,
    iconColor: "#00838F",
    tileBg: "bg-[#E0F7FA]",
    tileAccent: "#B2EBF2",
    message: "Hello Pharmos, I need nursing staff at home.",
  },
  {
    id: "delivery",
    label: "Medicines\nDelivery",
    icon: Truck,
    iconColor: "#E65100",
    tileBg: "bg-[#FFF3E0]",
    tileAccent: "#FFE0B2",
    message: "Hello Pharmos, I want medicine delivery.",
  },
  {
    id: "blood sample collection", 
    label: "blood sample collection",
    icon: TestTubesIcon ,
    iconColor: "#0A6E9C",
    tileBg: "bg-[#E8F5FF]",
    tileAccent: "#C2E2F7",
    message: "Hello Pharmos, I want a blood sample collection at home.",
  },
  {
    id: "pateint care",
    label: "patient personal care",
    icon: HeartHandshake,
    iconColor: "#6A1B9A",
    tileBg: "bg-[#F3E5F5]",
    tileAccent: "#E1BEE7",
    message: "Hello Pharmos, I want home patient personal care .",
  },
];

function WABtn({ message }: { message: string }) {
  return null; (
    <button
      onClick={(e) => { e.stopPropagation(); openWhatsApp(message); }}
      className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center hover:bg-[#1fb855] active:scale-90 transition-all shadow-sm flex-shrink-0"
      aria-label="WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </button>
  );
}

export default function HomeServices() {
  return (
    <section className="px-4 mt-6">
      <div className="flex items-center mb-3">
        <div className="w-1 h-6 bg-[#0A6E9C] rounded-full mr-2" />
        <h2 className="text-gray-900 font-bold text-lg">Home Services</h2>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <button
              key={svc.id}
              onClick={() => openWhatsApp(svc.message)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95"
            >
              {/* Icon tile */}
              <div className={`w-full aspect-square rounded-xl ${svc.tileBg} flex items-center justify-center relative overflow-hidden`}>
                <div
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full opacity-30 translate-x-3 translate-y-3"
                  style={{ backgroundColor: svc.tileAccent }}
                />
                <div
                  className="absolute top-0 left-0 w-6 h-6 rounded-full opacity-20 -translate-x-2 -translate-y-2"
                  style={{ backgroundColor: svc.tileAccent }}
                />
                <Icon size={32} color={svc.iconColor} strokeWidth={1.6} />
              </div>

              {/* Label */}
              <span className="text-gray-800 text-[10px] font-bold text-center leading-tight whitespace-pre-line">
                {svc.label}
              </span>

              {/* WhatsApp button */}
              <WABtn message={svc.message} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
