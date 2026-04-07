import { Link } from 'react-router-dom';

export default function Navbar(){
    return(
        <nav className="p-6 flex justify-between items-center bg-white shadow-sm">
            <Link
                to={"/"}
            >
                <h1 className="text-2xl font-bold text-blue-600">TimeWork</h1>
            </Link>
                <div className="space-x-4">
                    <Link to={"/signin"} className="text-gray-600 hover:text-blue-600">
                        Connexion
                    </Link>
                    <Link to={"/disponibilite"} className="text-gray-600 hover:text-blue-600">
                        Formulaire de Disponibilités
                    </Link>
                    <Link to={"/signup"} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Essai Gratuit
                    </Link>
                </div>
        </nav>
    )
}