import { useToast } from '@/utils/hooks/useToast'

function getColor(type: 'error' | 'success' | 'warning' | 'notify'): string {
    switch (type) {
        case 'error':
            return 'oklch(var(--er))'
        case 'success':
            return 'oklch(var(--su))'
        case 'warning':
            return 'oklch(var(--wa))'
        case 'notify':
            return 'oklch(var(--wa))'
        default:
            throw new Error(`Unsupported type: ${type}`);
    }
}

const Toast = () => {
    const toast = useToast()
    return (
        <div className='toast toast-top toast-center top-20 z-50'>
            {toast.toasts[0] && toast.toasts.map((toast) => (
                <div key={`toast-${toast.id}`} style={{ backgroundColor: getColor(toast.type) }} className={'alert text-black'}>{toast.message}</div>
            ))
            }
        </div >
    )
}

export default Toast