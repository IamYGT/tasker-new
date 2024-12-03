import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface StatCardProps {
    title: string;
    value: number;
    icon: IconType;
    color: string;
    textColor: string;
    onClick?: () => void;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    textColor,
    onClick,
}: StatCardProps) => (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={`${color} rounded-2xl p-6 shadow-sm ${textColor} ${onClick ? 'cursor-pointer transition-opacity hover:opacity-90' : ''}`}
        onClick={onClick}
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
    </motion.div>
);
