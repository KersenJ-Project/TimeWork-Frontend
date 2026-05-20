import React from 'react';
import { Save, Loader2 } from 'lucide-react';

const ModalFooter = ({
  loading,
  editingCompany,
  onClose,
  t
}) => {
  return (
    <div className="sticky bottom-0 bg-slate-900 border-t border-white/5 px-8 py-5 flex justify-end gap-3">

      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl border border-white/10 font-bold text-slate-300 hover:bg-slate-800 transition-colors"
      >
        {t.cancelBtn}
      </button>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 disabled:opacity-50 transition-colors"
      >

        {loading ? (
          <Loader2
            size={18}
            className="animate-spin"
          />
        ) : (
          <Save size={18} />
        )}

        {editingCompany
          ? t.confirmEditBtn
          : t.confirmDeployBtn}

      </button>
    </div>
  );
};

export default ModalFooter;