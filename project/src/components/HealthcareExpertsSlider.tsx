import { useEffect, useState } from "react";

const experts = [
  {
    name: "Dr. Arpit Jain",
    role: "Cardiologist",
    qualification: "MBBS, MD, DrNB Cardiology",
    experience: "7 Years Experience",
    icon: "❤️",
    color: "bg-red-50",
  },
  {
    name: "Dr. Chinmay Chincholikar",
    role: "Orthopedic Surgeon",
    qualification: "MBBS, MS (Orthopedics)",
    experience: "12 Years Experience",
    icon: "🦴",
    color: "bg-blue-50",
  },
  {
    name: "Drx. Himanshu Gupta",
    role: "Medication Expert",
    qualification: "B.Pharm, DCMS & ED",
    experience: "8 Years Experience",
    icon: "💊",
    color: "bg-cyan-50",
  },
  {
    name: "Drx. Himanshu Gupta",
    role: "Nutritionist",
    qualification: "Certified Nutritionist",
    experience: "8 Years Experience",
    icon: "🥗",
    color: "bg-green-50",
  },
];

export default function HealthcareExpertsSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % experts.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const expert = experts[current];

  return (
    <section className="px-4 mt-6">
      <h2 className="text-lg font-bold text-gray-800 mb-3">
        Our Healthcare Experts
      </h2>

      <div
        className={`${expert.color} rounded-2xl shadow-lg border border-gray-100 p-5 transition-all duration-700`}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow">
            {expert.icon}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              {expert.name}
            </h3>

            <p className="text-[#0A6E9C] font-semibold">
              {expert.role}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              {expert.qualification}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              {expert.experience}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-green-600 text-sm font-medium">
            ● Available
          </span>

          <span className="text-xs text-gray-400">
            {current + 1} / {experts.length}
          </span>
        </div>
      </div>
    </section>
  );
}
