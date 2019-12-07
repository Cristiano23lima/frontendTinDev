import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';
import "./Main.css";

import api from '../services/api';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ match }){//pega todos os parametros passado na rota main
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState();
    
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
    
    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        });

        socket.on('match', dev => {
            setMatchDev(dev);
        })
    }, [match.params.id])

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

            { matchDev && (
                <div className="match-container">
                    <img src={itsamatch} alt="It's a match" />
                    
                    <img className="avatar" src={matchDev.avatar} alt="Avatar" />
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>

                    <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
                </div>
            )}
        </div>
    );
}