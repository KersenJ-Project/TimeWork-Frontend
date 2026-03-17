import { ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="p-6 flex justify-between items-center bg-white shadow-sm">
                <h1 className="text-2xl font-bold text-blue-600">TimeWork</h1>
                    <div className="space-x-4">
                    <a href="/signin" className="text-gray-600 hover:text-blue-600">Connexion</a>
                    <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Essai Gratuit</a>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto mt-20 px-6 text-center">
                <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
                Propulsez votre entreprise vers le futur
                </h2>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                La plateforme tout-en-un pour gérer vos équipes, vos projets et votre croissance en toute simplicité.
                </p>
                <button className="flex items-center mx-auto bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:gap-3 transition-all">
                    Commencer maintenant <ArrowRight className="ml-2" />
                </button>
            </main>
        </div>
    );
};

export default Home;