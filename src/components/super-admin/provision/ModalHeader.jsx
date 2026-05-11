import React from 'react';
import { X } from 'lucide-react';

const ModalHeader = ({
  editingCompany,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white shrink-0">

      <div>
        <h2 className="text-3xl font-black text-gray-900">
          {editingCompany
            ? 'Modifier une Entreprise'
            : 'Provisionner un Nouveau Client'}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Configurez l'entreprise et son gérant.
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-2.5 rounded-xl hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-700"
      >
        <X size={22} />
      </button>
    </div>
  );
};

export default ModalHeader;