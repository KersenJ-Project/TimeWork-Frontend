import React from 'react';
import { Save, Loader2 } from 'lucide-react';

const ModalFooter = ({
  loading,
  editingCompany,
  onClose,
}) => {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-5 flex justify-end gap-3">

      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50"
      >
        Annuler
      </button>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 disabled:opacity-50"
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
          ? 'Sauvegarder'
          : 'Lancer le déploiement'}

      </button>
    </div>
  );
};

export default ModalFooter;