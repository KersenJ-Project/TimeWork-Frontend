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
        bg-slate-900/50
        rounded-[2rem]
        border border-white/5
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

                <p className="text-sm font-black tracking-[0.2em] text-slate-400 uppercase mb-2">
                    {label}
                </p>

                <p className="text-5xl font-black text-white">
                    {value}
                </p>

            </div>

        </div>
    );
};

export default StatCard;