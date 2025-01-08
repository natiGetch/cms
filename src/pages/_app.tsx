import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { LoadingProvider } from '@/context/loadingContext'
import AppWrapper from '@/component/layout/appWraper'
import { ErrorProvider } from '@/context/errorContext'
import { notification } from 'antd'
import { usePathname } from 'next/navigation'


export default function App({ Component, pageProps }: AppProps) {
  notification.config({
    maxCount : 1
  });

  return (
    <LoadingProvider>
      <ErrorProvider>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
      </ErrorProvider>
    </LoadingProvider>
  )
}
