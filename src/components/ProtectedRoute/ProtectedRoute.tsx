
import { useCurrentUser } from '@/utils/hooks/useCurrentUser'
import { type PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorBoundary from '../DragAndDrop/ErrorBoundary'

type ProtectedRouteProps = PropsWithChildren

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate()
    const { user, status } = useCurrentUser()

    useEffect(() => {
        if (status === 'success' && !user || status === 'error') {
            navigate('/signin', { replace: true })
        }
    }, [navigate, user, status])
    return (
        <>
            {status === 'pending' &&
                <div className='flex h-screen justify-center items-center'>
                    <span className="loading loading-dots loading-lg" />
                </div>
            }

            {status === 'success' &&
                <>
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </>
            }
        </>
    )
}

export default ProtectedRoute