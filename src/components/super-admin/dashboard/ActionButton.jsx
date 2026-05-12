import React from 'react';

const ActionButton = ({
    children,
    color,
    onClick,
}) => {
    const styles = {
        indigo:
            'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',

        gray:
            'bg-gray-100 text-gray-700 hover:bg-gray-200',

        red:
            'bg-red-50 text-red-500 hover:bg-red-100',
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