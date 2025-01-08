"use client"
import React from 'react'
import { Alert, Breadcrumb, Card, Layout, Menu, Spin,notification} from 'antd'
import menus from '@/data/menu/data';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLoading } from '@/context/loadingContext';
import { useError } from '@/context/errorContext';
import { useRouter } from 'next/router';
const { Header, Content, Footer } = Layout;
interface AppWrapper {
    children: React.ReactNode;
  }
const AppWrapper : React.FC<AppWrapper> = ({children}) => {
 const {isLoading} = useLoading()
 const router = useRouter()
 const {error} = useError()
 const pathName = usePathname()
 const menuItems = menus.map(item => ({
    key: item.key,
    label: item.link ? <Link href={item.link}>{item.label}</Link> : item.label,
    children: item.children
      ? item.children.map(child => ({
          key: child.key,
          label: <Link href={child.link}>{child.label}</Link>,
        }))
      : undefined,
  }));

 const breadcrumbItems = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: pathName?.replace('/','').charAt(0).toUpperCase() + pathName?.slice(2), href: '#' },
  ];
  return (
     <React.Fragment>
          {
      pathName != '/login' ?
      <Layout>
      <Header
      style={{
        position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
      }}>
          <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[pathName]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px',height : 'calc(100vh - 100px)'}}>
      <Breadcrumb
          items={breadcrumbItems.map(item => ({
            title: <Link href={item.href}>{item.title}</Link>,
          }))}
          style={{ margin: '16px 0' }}
        />
         <Card style={{maxHeight :'calc(100vh - 132px)',overflowY : 'hidden'}}>
          <Spin spinning={isLoading} fullscreen/>
           { !error ? 
           children : 
           <Alert
              message="Error"
              description="Something Went Wrong"
              type="error"
            />
          }
         </Card>
      </Content>
      <Footer style={{position : 'fixed',bottom : 0,width: '100%',textAlign : 'center'}}>
       Binget MicroFincance ©{new Date().getFullYear()}
      </Footer>
    </Layout> :
      <Layout>
        {children}
      </Layout>
      }
     </React.Fragment>
  )
}

export default AppWrapper
