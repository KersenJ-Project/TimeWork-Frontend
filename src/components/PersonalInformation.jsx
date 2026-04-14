import React, { useState } from 'react';
import { Mail, Wallet, Clock, TrendingUp, Info, Edit2 } from 'lucide-react';
import { UserRole } from '../enum/UserRole';
import { motion } from 'motion/react';

export default function PersonalInformation() {
  const [user] = useState({
    firstName: "Employee",
    lastName: "Test",
    email: "employee@test.com",
    role: UserRole.ASSISTANT_MANAGER,
    hourlyRate: 25.00,
    hoursWorked: 38.5,
  });

  const estimatedPay = (user.hourlyRate * user.hoursWorked).toFixed(2);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-blue-600" />
        <div className="p-6 flex flex-col md:flex-row items-center gap-5">

          <div className="relative shrink-0">
            <div className="h-20 w-20 bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold tracking-tight">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1.5">
              <h3 className="text-xl font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 0px 0px rgba(37, 99, 235, 0)",
                    "0 0 8px 3px rgba(37, 99, 235, 0.25)",
                    "0 0 0px 0px rgba(37, 99, 235, 0)",
                  ],
                  borderColor: [
                    "rgba(191, 219, 254, 1)",
                    "rgba(37, 99, 235, 0.5)",
                    "rgba(191, 219, 254, 1)",
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1.5,
                }}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border w-fit mx-auto md:mx-0"
              >
                {user.role}
              </motion.span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-gray-400">
              <Mail size={14} />
              <span className="text-sm">{user.email}</span>
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Edit2 size={13} />
            Modifier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-50 rounded-lg">
                <Wallet size={16} className="text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Rémunération</span>
            </div>
            <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase tracking-wide">
              Période active
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2.5">
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600 font-medium">Taux horaire</span>
              </div>
              <span className="text-sm font-semibold text-blue-700">{user.hourlyRate.toFixed(2)} $ / h</span>
            </div>

            <div className="px-4 py-4 rounded-xl bg-gray-900 relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-5">
                <TrendingUp size={72} className="text-white" />
              </div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-1">Prochaine paie (est.)</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-white">{estimatedPay} $</span>
                    <span className="text-xs text-gray-500 font-medium">brut</span>
                  </div>
                </div>
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <TrendingUp size={16} className="text-blue-400" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center relative z-10">
                <span className="text-[11px] text-gray-500">Basé sur {user.hoursWorked}h travaillées</span>
                <Info size={13} className="text-gray-600 hover:text-gray-400 transition-colors cursor-help" />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Mis à jour le 13 Avril 2026</p>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          Signaler une erreur
        </button>
      </div>

    </div>
  );
}