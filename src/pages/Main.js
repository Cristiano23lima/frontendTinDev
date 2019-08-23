import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import "./Main.css";

import api from '../services/api';

export default function Main({ match }){//pega todos os parametros passado na rota main
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        async function loadUsers(){
            const response = await api.get("/devs", {
                headers: {
                    user: match.params.id, 
                }
            });

            setUsers(response.data);
        }

        loadUsers();
    }, [match.params.id]) //primeiro parametro a função que eu quero executar, e o segundo parametro é quando eu quero executa-la
    
    async function handleLike(id){
        await api.post(`/devs/${id}/likes`, null, {
            headers: {
                user: match.params.id
            }
        });

        setUsers(users.filter(user => user._id !== id));
    }
    
    async function handleDislike(id){
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: {
                user: match.params.id
            }
        });

        setUsers(users.filter(user => user._id !== id));

    }

    return (
        <div className="main-container">
            <Link to="/">
                <h2 className="logo">TINDEV</h2>
            </Link>
            { users.length > 0 ? 
                (
                    <ul>
                        {users.map(user => (
                            <li key={user._id}>
                                <img src={user.avatar} alt={user.name} />
                                <footer>
                                    <strong>{user.name}</strong>
                                    <p>{user.bio}</p>
                                </footer>
                                <div className="buttons">
                                    <button onClick={() => handleDislike(user._id)} type="button" style={{color: "red"}}>Dislike</button>
                                    <button onClick={() => handleLike(user._id)} type="button" style={{color: "green"}}>Like</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )
                : 
                (
                    <div className="empty">Acabou :(</div>
                )
            }
        </div>
    );
}