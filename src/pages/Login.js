import React, {useState} from 'react';
import './login.css';

import api from '../services/api';

export default function Login({ history }){
    const [username, setUsername] = useState('');//username->tem o valor final e o setUsername->fica pegando os valores mandados e enviando pro username
    
    async function handleSubmit(e){
        e.preventDefault();

        const response = await api.post('/devs', {
            username,
        });

        const { _id } = response.data;

        history.push(`/dev/${_id}`);
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2 className="logo">TINDEV</h2>
                <input 
                    placeholder="Digite seu usuário no Github"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}