import { BrowserRouter,useNavigate } from 'react-router-dom'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import SessionTimeout from './SessionTimeout'


if (appConfig.enableMock) {
    import('./mock')
}

function App() {
;

    return (
        <Theme>
            <BrowserRouter>
                <AuthProvider>
                <SessionTimeout />
                    <Layout>
                        <Views />
                    </Layout>
                
                </AuthProvider>
            </BrowserRouter>
        </Theme>
    )
}

export default App
