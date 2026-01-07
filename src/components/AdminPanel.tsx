import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Award, LoadingState } from '../types';

const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [awards, setAwards] = useState<Award[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  // New Award State
  const [newAwardTitle, setNewAwardTitle] = useState('');
  const [newAwardIssuer, setNewAwardIssuer] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchAwards();
    });
    return () => unsubscribe();
  }, []);

  const fetchAwards = async () => {
    try {
      // Mock data if Firestore is not actually set up with credentials
      // In real app: const querySnapshot = await getDocs(collection(db, "awards"));
      // setAwards(querySnapshot.docs.map(d => ({id: d.id, ...d.data()} as Award)));

      // Mocking for this demo since we can't guarantee backend
      setAwards([
        { id: '1', title: 'Awwwards SOTD', issuer: 'Awwwards', date: '2024-01-15', validated: true },
        { id: '2', title: 'Mejor UI/UX', issuer: 'Behance', date: '2023-11-20', validated: false }
      ]);
    } catch (e) {
      console.error("Firestore error", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(LoadingState.LOADING);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
      // Fallback for demo purposes if auth fails due to missing config
      if (import.meta.env.DEV) {
        // alert("Auth failed (expected without valid keys).");
      }
    }
  };

  const handleAddAward = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to add to firestore
    const newAward: Award = {
      id: Date.now().toString(),
      title: newAwardTitle,
      issuer: newAwardIssuer,
      date: new Date().toISOString(),
      validated: false
    };
    setAwards([...awards, newAward]);
    setNewAwardTitle('');
    setNewAwardIssuer('');
  };

  const toggleValidation = (id: string) => {
    setAwards(awards.map(a => a.id === id ? { ...a, validated: !a.validated } : a));
    // In real app: await updateDoc(doc(db, "awards", id), { validated: !current });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-50 flex items-center justify-center">
        <div className="w-full max-w-md p-8 border border-stone-700 rounded-lg">
          <h2 className="text-3xl font-serif mb-6 italic">Acceso Restringido</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-stone-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-800 border border-stone-600 p-2 rounded focus:border-terracotta outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-stone-400">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-800 border border-stone-600 p-2 rounded focus:border-terracotta outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-terracotta py-2 rounded text-white font-bold hover:bg-stone-600 transition">
              {status === LoadingState.LOADING ? 'Validando...' : 'Entrar a Consola'}
            </button>
            {status === LoadingState.ERROR && <p className="text-red-500 text-sm">Acceso Denegado.</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-serif font-bold">Consola de Admin</h1>
          <button onClick={() => signOut(auth)} className="text-sm underline">Cerrar Sesión</button>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4">Agregar Nuevo Premio</h3>
            <form onSubmit={handleAddAward} className="space-y-4 bg-white p-6 shadow-lg rounded-xl">
              <input
                placeholder="Título del Premio"
                className="w-full border-b border-stone-300 p-2 outline-none focus:border-terracotta"
                value={newAwardTitle}
                onChange={e => setNewAwardTitle(e.target.value)}
              />
              <input
                placeholder="Emisor"
                className="w-full border-b border-stone-300 p-2 outline-none focus:border-terracotta"
                value={newAwardIssuer}
                onChange={e => setNewAwardIssuer(e.target.value)}
              />
              <button className="bg-stone-900 text-white px-6 py-2 rounded-full">Agregar</button>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Validación de Premios</h3>
            <div className="space-y-2">
              {awards.map(award => (
                <div key={award.id} className="flex items-center justify-between bg-white p-4 shadow-sm rounded-lg border-l-4 border-stone-200">
                  <div>
                    <p className="font-bold">{award.title}</p>
                    <p className="text-xs text-stone-500">{award.issuer}</p>
                  </div>
                  <button
                    onClick={() => toggleValidation(award.id)}
                    className={`px-3 py-1 text-xs rounded-full ${award.validated ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'}`}
                  >
                    {award.validated ? 'Validado' : 'Pendiente'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;