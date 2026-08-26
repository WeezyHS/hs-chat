import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Usuário ou senha incorretos!');
                setLogin('');
                setPassword('');
                return;
            }

            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/chat');
        } catch (err) {
            setError('Não foi possível se conectar!');
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 py-16">
            <h1 className="text-5xl font-semibold tracking-tight text-white mb-8">Entrar no Sistema</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-2">
                <input className="w-full rounded-md bg-white/5 px-3.5 py-1 text-base text-white outline-1 outline-white/10" type="text" placeholder="Usuário ou e-mail" value={login} onChange={(e) => setLogin(e.target.value)} /><p/>
                <input className="w-full rounded-md bg-white/5 px-3.5 py-1 text-base text-white outline-1 outline-white/10" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-md py-1 mt-2 transition-colors cursor-pointer">Entrar</button>
            </form>
            <p className="text-gray-400 mt-6">Não tem conta ainda? Crie a sua.</p>
            <button onClick={() => navigate(('/Register'))} className="text-indigo-400 hover:text-indigo-300 mt-1 cursor-pointer">Criar Conta</button>
        </div>
    );
}

export default Login;