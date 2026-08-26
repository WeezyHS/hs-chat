import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();
    
            if (!response.ok) {
                setError(data.error || 'Erro ao criar conta!');
                return;
            }
    
            navigate('/');
        } catch(err) {
            setError('Não foi possível conectar ao servidor!');
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 py-16">
            <h1 className="text-5xl font-semibold tracking-tight text-white mb-8">Criar Conta</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-2">
                <label className="text-white font-semibold">Digite seu nome de usuário:</label>
                <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-md bg-white/5 px-3.5 py-1 text-base text-white outline-1 outline-white/10"></input>
                <label className="text-white font-semibold">Digite seu e-mail:</label>
                <input type="text" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md bg-white/5 px-3.5 py-1 text-base text-white outline-1 outline-white/10"></input>
                <label className="text-white font-semibold">Digite sua senha:</label>
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md bg-white/5 px-3.5 py-1 text-base text-white outline-1 outline-white/10 mb-4"></input>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-10">
                    <button onClick={() => navigate('/')} type="button" className="w-22 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md py-1 mt-2 transition-colors cursor-pointer">Voltar</button>
                    <button type="submit" className="w-25 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md py-1 mt-2 transition-colors cursor-pointer">Criar</button>
                </div>
            </form>
        </div>
    );
}

export default Register;