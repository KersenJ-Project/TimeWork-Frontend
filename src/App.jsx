import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './AppRoutes';



export default function App(){
    return(
      <BrowserRouter>
        <div className="flex flex-col min-h-screen w-full">
          <Navbar />
          <main className="flex grow items-stretch justify-center w-full">
              <AppRoutes />
          </main>
        </div>
      </BrowserRouter>
    )
}