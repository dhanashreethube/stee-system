

export const ViolationBadge = ({ count, max }: { count: number, max: number }) => {
    const color = count === 0 ? 'bg-green-100 text-green-800' :
        count < 3 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800';

    return (
        <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${color} border border-current`}>
            STRIKES: {count}/{max}
        </div>
    );
};
