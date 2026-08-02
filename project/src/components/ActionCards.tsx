import { openWhatsApp } from "../config";

export default function ActionCards() {
  return  (
    <div className="px-4 mt-6 grid grid-cols-2 gap-3">
      {/* Order Medicines Card */}
      <button
        onClick={() => openWhatsApp("Hello Pharmos, I want to order medicines. Please guide me.")}
        className="bg-[#0A6E9C] rounded-2xl p-4 text-left flex flex-col justify-between min-h-[150px] hover:bg-[#085d85] transition-colors shadow-lg relative overflow-hidden active:scale-95"
      >
        {/* Background decoration */}
        <div className="absolute right-0 bottom-0 opacity-20">
          <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
            <circle cx="60" cy="60" r="40" fill="white" />
          </svg>
        </div>

        <div>
          <h3 className="text-white font-bold text-base leading-tight">Order Medicines</h3>
          <p className="text-blue-200 text-xs mt-1">Quick &amp; easy delivery</p>
        </div>

        {/* Medicine illustration */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70">
          <svg viewBox="0 0 60 60" fill="none" className="w-16 h-16">
            <rect x="18" y="8" width="24" height="32" rx="5" fill="#F9A825" opacity="0.9" />
            <rect x="20" y="6" width="20" height="6" rx="2" fill="#F9A825" opacity="0.6" />
            <rect x="24" y="16" width="12" height="3" rx="1.5" fill="white" />
            <rect x="28" y="12" width="4" height="11" rx="2" fill="white" />
            <ellipse cx="22" cy="46" rx="6" ry="3.5" fill="#E91E63" opacity="0.8" transform="rotate(-20 22 46)" />
            <ellipse cx="38" cy="44" rx="6" ry="3.5" fill="#4CAF50" opacity="0.8" transform="rotate(15 38 44)" />
          </svg>
        </div>

        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mt-3">
          <svg viewBox="0 0 20 20" fill="white" className="w-5 h-5">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Book Doctor Appointment Card */}
      <button
        onClick={() => openWhatsApp("Hello Pharmos, I want to book a doctor appointment.")}
        className="bg-[#F9A825] rounded-2xl p-4 text-left flex flex-col justify-between min-h-[150px] hover:bg-[#e09520] transition-colors shadow-lg relative overflow-hidden active:scale-95"
      >
        {/* Background decoration */}
        <div className="absolute right-0 bottom-0 opacity-15">
          <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20">
            <circle cx="60" cy="60" r="40" fill="white" />
          </svg>
        </div>

        <div>
          <h3 className="text-white font-bold text-base leading-tight">Doctor Consultation</h3>
          <p className="text-yellow-100 text-xs mt-1">Chat with doctor on WhatsApp</p>
        </div>

        {/* WhatsApp illustration */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60">
          <svg viewBox="0 0 24 24" fill="white" className="w-14 h-14">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>

        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mt-3">
          <svg viewBox="0 0 20 20" fill="white" className="w-5 h-5">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
    </div>
  );
}
