import { useEffect, useState } from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { LoadingProvider } from '@/context/loadingContext'
import AppWrapper from '@/component/layout/appWraper'
import { ErrorProvider } from '@/context/errorContext'
import { notification } from 'antd'


export default function App({ Component, pageProps }: AppProps) {
  const route = useRouter()
  const [isTokenAvailable, setIsTokenAvailable] = useState(false)
  notification.config({
   
    maxCount : 1
  });
  useEffect(() => {
    const fetchToken = async () => {
      const token = localStorage.getItem('token')
      if (token) {
       
        setIsTokenAvailable(true) // Set the state to true if token exists
      }
    }
    fetchToken()
  }, [route])

  if (!isTokenAvailable) {
    return <LoadingProvider>
          <ErrorProvider>
           <Component {...pageProps} />
           </ErrorProvider>
         </LoadingProvider> // Show loading or fallback if no token
  }

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
