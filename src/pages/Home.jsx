import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home(){
    return (
        <div className="min-h-screen min-w-screen bg-gray-50">

            <main className="mx-auto mt-20 px-6 text-center">
                <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
                Propulsez votre entreprise vers le futur
                </h2>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                La plateforme tout-en-un pour gérer vos équipes, vos projets et votre croissance en toute simplicité.
                </p>
                <Link to={"/signup"}>
                    <button className="flex items-center mx-auto bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:gap-3 transition-all">
                        Commencer maintenant <ArrowRight className="ml-2" />
                    </button>
                </Link>
            </main>
        </div>
    );
};