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

    const handleAddResponse = () => {
        if (input.trim()) {
            // Assuming the symbol has an ID when added (you might need to add logic for ID generation)
            const newSymbol = { symbol: input.trim(), id: Date.now() }; // Using Date.now() as an example ID
            setResponses([...responses, newSymbol]);
            setInput('');
        }
    };

    const handleRemoveResponse = (index) => {
        setResponses(responses.filter((_, i) => i !== index));
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

                // Assuming response.data is an array of symbol objects
                const fetchedSymbols = response.data.map(symbol => ({
                    symbol: symbol.symbol,
                    id: symbol.id,
                }));

                setSymbols(fetchedSymbols);
                setResponses(fetchedSymbols);  // Initialize responses with symbols from the server

            } catch (err) {
                alert(err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleDeletion = async () => {
            // Find elements added to responses but not in symbols
            const added = responses.filter(response => !symbols.some(symbol => symbol.symbol === response.symbol));

            // Find elements in symbols but not in responses (to be removed)
            const removed = symbols.filter(symbol => !responses.some(response => response.symbol === symbol.symbol));

            if (added.length > 0) {
                setSymbols(prevSymbols => [...prevSymbols, ...added]);
            }

            if (removed.length > 0) {
                // Log the ids of the removed symbols
                removed.forEach(symbol => alert(symbol.id)); // Access id for each symbol

                setSymbols(prevSymbols => prevSymbols.filter(symbol => !removed.includes(symbol)));

                // Perform delete operation for removed IDs
                const deletePromises = removed.map(async (symbol) => {
                    if (symbol.id) {
                        try {
                            await api.delete(`/api/admin/symbols/${symbol.id}`);
                        } catch (e) {
                            console.error(`Error deleting symbol with ID: ${symbol.id}`, e);
                        }
                    }
                });

                // Wait for all deletions to complete
                await Promise.all(deletePromises);
            }
        };

        handleDeletion(); // Call the async function

    }, [responses]);

    return (
        <div className="AdminPanel">
            <div className="AdminPanel-Stocks">
                <Box sx={{ maxWidth: '400px', margin: '20px auto', textAlign: 'center' }}>
                    <TextField
                        label="Stock Name"
                        variant="outlined"
                        type="search"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        fullWidth
                    />
                    <Button
                        onClick={handleAddResponse}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Add
                    </Button>

                    <Box sx={{ mt: 3 }}>
                        {responses.map((response, index) => (
                            <Box
                                key={response.id}  // Use the id as the key
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    mt: 1,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <span>{response.symbol}</span>
                                <Button
                                    onClick={() => handleRemoveResponse(index)}
                                    variant="text"
                                    sx={{
                                        color: 'white',
                                        ml: 1,
                                        minWidth: 'auto',
                                        padding: '0',
                                    }}
                                >
                                    X
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </div>
        </div>
    );
}
