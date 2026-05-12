import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './AppRoutes';
import ScrollToTop from './components/ScrollToTop';



export default function App(){
    return(
      <BrowserRouter>
        <div className="flex flex-col min-h-screen w-full">
          <Navbar />
          <main className="flex grow items-stretch justify-center pt-20 w-full">
            <ScrollToTop />
            <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    )
}