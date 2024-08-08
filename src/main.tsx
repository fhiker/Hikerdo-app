import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes.tsx'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import '../i18n'
import common_en from '@/locales/en/en.json'
import common_es from '@/locales/es/es.json'
import common_fr from '@/locales/fr/fr.json'
import common_jp from '@/locales/jp/jp.json'
import common_cz from '@/locales/cz/cz.json'
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: {
    en: {
      common: common_en
    },
    es: {
      common: common_es
    },
    fr: {
      common: common_fr
    },
    jp: {
      common: common_jp
    },
    cz: {
      common: common_cz
    },
  },
});

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>
      <I18nextProvider i18n={i18next}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </I18nextProvider>
    </Suspense>
  </React.StrictMode >,
)