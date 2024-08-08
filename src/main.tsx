import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes.tsx'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '../i18n'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </I18nextProvider>
    </Suspense>
  </React.StrictMode >,
)