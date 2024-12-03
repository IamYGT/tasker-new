import React from 'react';
import { IconType } from 'react-icons';

interface StatCardProps {
    title: string;
    value: number;
    icon: IconType;
    color: string;
    textColor: string;
    onClick?: () => void;
}

export const StatCard = ({ title, value, icon: Icon, color, textColor, onClick }: StatCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`${color} rounded-xl p-6 shadow-sm transition-all hover:shadow-md ${textColor} ${
                onClick ? 'cursor-pointer' : ''
            }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-90">{title}</p>
                    <p className="mt-2 text-2xl font-bold">{value}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};
