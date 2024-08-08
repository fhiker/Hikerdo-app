import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import ProjectPage from '@/pages/ProjectPage'
import SettingsPage from '@/pages/SettingsPage'
import SignInPage from '@/pages/SignInPage'
import SignUpPage from '@/pages/SignUpPage'
import { createBrowserRouter } from 'react-router-dom'
import TeamsPage from '@/pages/TeamsPage'
import MembersPage from '@/pages/MembersPage'

const router = createBrowserRouter([
    {
        path: '/project/:id', element: (
            <ProtectedRoute>
                <ProjectPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '*', element: (
            //TODO: Error Page here
            <div>Erorr Happened!</div>
        )
    },
    {
        path: '/', element: (
            <ProtectedRoute>
                <HomePage />
            </ProtectedRoute>
        )
    },
    { path: '/signin', element: <SignInPage /> },
    { path: '/signup', element: <SignUpPage /> },
    {
        path: '/settings', element: (
            <ProtectedRoute>
                <SettingsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/teams', element: (
            <ProtectedRoute>
                <TeamsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/teams/:id', element: (
            <ProtectedRoute>
                <MembersPage />
            </ProtectedRoute>
        ),
    },
])

export default router