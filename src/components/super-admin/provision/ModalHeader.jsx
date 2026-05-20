import React from 'react';
import { X } from 'lucide-react';

const ModalHeader = ({
  editingCompany,
  onClose,
  t
}) => {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-slate-900 shrink-0">

      <div>
        <h2 className="text-3xl font-black text-white">
          {editingCompany
            ? t.editTenantTitle
            : t.createTenantTitle}
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          {editingCompany ? t.modifyDetailsDesc : t.provisionCompanyDesc}
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-2.5 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
      >
        <X size={22} />
      </button>
    </div>
  );
};

export default ModalHeader;