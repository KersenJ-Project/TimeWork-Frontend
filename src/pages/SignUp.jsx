import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export default function SignUp(){
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/auth/signup', formData);

      if (response.status === 201 || response.status === 200) {
        console.log("Utilisateur créé !", response.data);
        navigate('/signin')
      }
    } catch (error) {
      console.error("Erreur back-end :", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Créer un compte</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input 
                type="text" 
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input 
                type="text" 
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email professionnel</label>
            <input 
              type="email" 
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input 
              type="password" 
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md">
            Créer mon compte
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ? <a href="/signin" className="text-green-600 font-bold hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
};