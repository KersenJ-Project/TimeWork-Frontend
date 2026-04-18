import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export default function SignIn(){
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/signin', formData);

      if (response.status === 200 || response.status === 201) {
        const token = response.data.access_token;

        if (token) {
          localStorage.setItem('token', token);
          
          console.log("Connexion réussie et token sauvegardé !");
          navigate('/');
        } else {
          console.error("Le backend n'a pas renvoyé de token.");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de la connexion.");
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="min-w-100 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Bon retour !</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              required
              placeholder="votre@email.com"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ? <a href="/signup" className="text-blue-600 font-bold hover:underline">S'inscrire</a>
        </p>
      </div>
    </div>
  );
};