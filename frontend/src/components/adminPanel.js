import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import api from "../services/api";

export default function AdminPanel({ token, user }) {

    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [responses, setResponses] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [users, setUsers] = useState([]);

    const handleAddResponse = async () => {
        if (input.trim ()) {
            const newSymbol = {symbol : input.trim ()};

            const exists = responses.some(response => response.symbol === newSymbol.symbol);

            if (exists) {
                alert("This symbol already exists in responses.");
                return;
            }

            setResponses ([...responses, newSymbol]);
            setInput ('');

            // Add symbol to db
            try {

                const response = await fetch(`http://localhost:3001/api/admin/add-symbol/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newSymbol)
                });

                if (!response.ok) {
                    const errorData = await response.json(); // Assuming server responds with JSON
                    alert(`Error ${response.status}: ${errorData.message || response.statusText}`);
                }

            } catch (e) {
                alert(e);
            }

        }
    };

    const handleRemoveResponse = async (index) => {
        const removedItem = responses[index];

        setResponses (responses.filter ((_, i) => i !== index));

        // Remove symbol from DB
        try {

            const response = await fetch(`http://localhost:3001/api/admin/symbols/` + removedItem.id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json(); // Assuming server responds with JSON
                alert(`Error ${response.status}: ${errorData.message || response.statusText}`);
            }

        } catch (e) {
            alert (e);
        }
    };

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate('/');
        }
    }, [user, navigate]);

    // Maps each current symbol to the list
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/admin/symbols');

                const fetchedSymbols = response.data.map(symbol => ({
                    symbol: symbol.symbol,
                    id: symbol.id,
                }));

                setSymbols(fetchedSymbols);
                setResponses(fetchedSymbols);

            } catch (err) {
                alert(err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsers(response.data);
            } catch (err) {
                alert(err);
                setUsers([]);
            }
        }

        fetchUsers()
    }, []);


    return (
        <div className="AdminPanel">
            <div className="AdminPanel-Stocks">
                <h2 style={{
                    marginBottom : '10px',
                    textAlign : 'center',
                    borderBottom : '2px solid #ccc',
                    paddingBottom : '5px',
                    width : '90%',
                }}>
                    Add or Remove Stocks
                </h2>
                <br/>
                <Box sx={{maxWidth : '400px', margin : '-7px 20px 20px 20px', textAlign : 'center'}}>
                    <TextField
                        label="Stock Name"
                        variant="outlined"
                        type="search"
                        value={input}
                        onChange={(e) => setInput (e.target.value)}
                        fullWidth
                    />
                    <Button
                        onClick={handleAddResponse}
                        variant="contained"
                        color="primary"
                        sx={{mt : 2}}
                        style={{width : "100%"}}
                    >
                        Add
                    </Button>

                    <Box sx={{
                        display : 'grid',
                        gridTemplateColumns : 'repeat(3, 1fr)',
                        gap : 1,
                        mt : 3,
                    }}>
                        {responses.map ((response, index) => (
                            <Box
                                key={response.id}
                                sx={{
                                    display : 'flex',
                                    alignItems : 'center',
                                    backgroundColor : '#007bff',
                                    color : 'white',
                                    padding : '8px 12px',
                                    borderRadius : '4px',
                                    justifyContent : 'space-between',
                                    fontSize : '15px',
                                    height : '40px', // Reduce height
                                }}
                            >
                                <span>{response.symbol}</span>
                                <Button
                                    onClick={() => handleRemoveResponse (index)}
                                    variant="text"
                                    sx={{
                                        color : 'white',
                                        ml : 1,
                                        minWidth : 'auto',
                                        padding : '0',
                                    }}
                                >
                                    X
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </div>

            <div className="AdminPanel-Users">
                <h2 style={{
                    marginBottom : '10px',
                    textAlign : 'center',
                    borderBottom : '2px solid #ccc',
                    paddingBottom : '5px',
                    width : '90%',
                }}>
                    All Users
                </h2>
                <br/>
                <Box sx={{maxWidth : '400px', margin : '-35px 20px 20px 20px', textAlign : 'center'}}>
                    <Box sx={{
                        display : 'grid',
                        gridTemplateColumns : 'repeat(3, 1fr)',
                        gap : 1,
                        mt : 3,
                    }}>
                        {users.map((user, index) => (
                            <Box
                                key={user.id}
                                sx={{
                                    display : 'flex',
                                    alignItems : 'center',
                                    backgroundColor : '#007bff',
                                    color : 'white',
                                    padding : '8px 12px',
                                    borderRadius : '4px',
                                    justifyContent : 'space-between',
                                    fontSize : '15px',
                                    height : '40px', // Adjust height
                                }}
                            >
                                {/* Avatar with initials */}
                                <Box
                                    sx={{
                                        width : '30px',
                                        height : '30px',
                                        backgroundColor : '#ffffff',
                                        color : '#007bff',
                                        borderRadius : '50%',
                                        display : 'flex',
                                        alignItems : 'center',
                                        justifyContent : 'center',
                                        fontWeight : 'bold',
                                        fontSize : '14px',
                                        marginRight : '10px',
                                    }}
                                >
                                    {user.firstName[0] + user.lastName[0]}
                                </Box>

                                <span>{user.firstName}</span>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </div>
        </div>
    );
}
