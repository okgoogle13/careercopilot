interface StatusMessageProps {
    status: {
        type: 'idle' | 'loading' | 'success' | 'error';
        message: string;
    };
}

const StatusMessage = ({ status }: StatusMessageProps) => {
    if (status.type === 'idle' || !status.message) {
        return null;
    }

    const bgColors = {
        loading: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
    };

    const icons = {
        loading: '⏳',
        success: '✅',
        error: '❌',
    };

    return (
        <div
            className={`mb-4 px-4 py-3 rounded-lg border ${bgColors[status.type]} text-sm flex items-center gap-2`}
        >
            <span>{icons[status.type]}</span>
            <span>{status.message}</span>
        </div>
    );
};

export default StatusMessage;
