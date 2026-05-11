import React from 'react';

const StatCard = ({
    icon,
    label,
    value,
    bg,
}) => {
    return (
        <div
            className="
        bg-white
        rounded-[2rem]
        border border-gray-200
        p-8
        flex
        items-center
        gap-6
        shadow-sm
      "
        >

            <div
                className={`
          w-20 h-20
          rounded-[1.5rem]
          flex
          items-center
          justify-center
          ${bg}
        `}
            >
                {icon}
            </div>

            <div>

                <p className="text-sm font-black tracking-[0.2em] text-gray-400 uppercase mb-2">
                    {label}
                </p>

                <p className="text-5xl font-black text-[#0B1023]">
                    {value}
                </p>

            </div>

        </div>
    );
};

export default StatCard;