import React from 'react';

const ActionButton = ({
    children,
    color,
    onClick,
}) => {
    const styles = {
        indigo:
            'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20',

        gray:
            'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700',

        red:
            'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
    };

    return (
        <button
            onClick={onClick}
            className={`
        w-11 h-11
        rounded-2xl
        flex
        items-center
        justify-center
        transition-all
        hover:scale-105
        ${styles[color]}
      `}
        >
            {children}
        </button>
    );
};

export default ActionButton;