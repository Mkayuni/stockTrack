import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import {FormHelperText, IconButton, InputAdornment, OutlinedInput} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../services/api";
import { useUser} from "../globals/globalUser";

export default function Settings({ token }) {

    const navigate = useNavigate();

    const { user, setUser } = useUser();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [verifiedPassword, setVerifiedPassword] = React.useState("");
    const [loading, setLoading] = useState(true);
    const [showVerifiedPassword, setShowVerifiedPassword] = React.useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/');  // Redirect to home if user is undefined
        } else {
            setLoading(false); // User is set, stop loading
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!user) {
            navigate('/');  // Redirect to home if user is undefined
        } else {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setUsername(user.username);
            setLoading(false); // User is set, stop loading
        }
    }, [user, navigate]);

    if (loading) {
        return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </div>);
    }

    const handleClickShowVerifiedPassword = () => setShowVerifiedPassword((show) => !show);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const updateNames = async () => {
        try {
            const updatedData = {
                id: user.id,
                firstName: firstName,
                lastName: lastName,
                email: user.email,
                username: user.username,
                password: user.password,
            };

            const response = await api.put('/api/users/self', updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update the global user state with the updated data
            setUser({
                ...user,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
            });

        } catch (err) {
            alert(err);
        }
    };

    const password_field = (verified) => {
        return (
            <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password" required>{verified ? "Verify Password" : "New Password"}</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={verified ? (showVerifiedPassword ? 'text' : 'password') : (showPassword ? 'text' : 'password')}
                    onChange={(e) => verified ? setVerifiedPassword(e.target.value) : setPassword (e.target.value)}
                    required
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={
                                    verified ? (showVerifiedPassword ? 'hide password' : 'show password') : (showPassword ? 'hide password' : 'show password')
                                }
                                onClick={verified ? handleClickShowVerifiedPassword : handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    }
                    label={verified ? "Verify Password" : "New Password"}
                    sx={{
                        '& fieldset' : {
                            //borderColor : (verified ? verifiedPasswordError : passwordError) !== 0 ? 'red' : 'grey',
                        },
                    }}
                />

                <FormHelperText style={{textAlign : 'center'}}>
                    {verified ? "Reenter your password for verification." : "Your password should be at least 8 characters long, and include at least one uppercase letter and one number. Adding special characters is recommended for extra security."}
                </FormHelperText>
            </FormControl>
        );
    }

    return (
        <div className="Settings">
            <div className="Settings-ChangePassword">
                <h2 style={{
                    marginBottom : '-10px',
                    textAlign : 'center',
                    borderBottom : '2px solid #ccc',
                    paddingBottom : '5px',
                    width : '90%',
                }}>
                    Change Password
                </h2>
                <br/>

                {password_field (false)}

                {password_field (true)}

                <Button variant="contained" /*onClick={() => registerUser ()}*/ sx={{backgroundColor : '#42A5F5', m : 1, width : '100%'}}>Change Password</Button>
            </div>

            <div className="Settings-Name">
                <h2 style={{
                    marginBottom : '-10px',
                    textAlign : 'center',
                    borderBottom : '2px solid #ccc',
                    paddingBottom : '5px',
                    width : '90%',
                }}>
                    Update Name
                </h2>
                <br/>

                <FormControl sx={{m : 1, width : '30ch'}} style={{flexGrow : '1', margin : '8px 0'}} variant="outlined">
                    <TextField
                        required
                        id="fname"
                        type="text"
                        defaultValue={user.firstName || ''}
                        label="First Name"
                        onChange={(e) => setFirstName (e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root' : {
                                '& fieldset' : {
                                    //borderColor : fnameError ? 'red' : 'grey',
                                },
                            },
                        }}
                    />
                </FormControl>

                <FormControl sx={{m : 1, width : '30ch'}} style={{flexGrow : '1', margin : '8px 0', paddingTop : '22px'}} variant="outlined">
                    <TextField
                        required
                        id="lname"
                        type="text"
                        defaultValue={user.lastName || ''}
                        label="Last Name"
                        sx={{
                            '& .MuiOutlinedInput-root' : {
                                '& fieldset' : {
                                    //borderColor : lnameError ? 'red' : 'grey',
                                },
                            },
                        }}
                        onChange={(e) => setLastName (e.target.value)}
                    />
                </FormControl>

                <Button variant="contained" onClick={() => updateNames ()} sx={{backgroundColor : '#42A5F5', m : 1, width : '100%'}}>Update Name</Button>
            </div>

            <div className="Settings-Email">
                <h2 style={{
                    marginBottom : '-10px',
                    textAlign : 'center',
                    borderBottom : '2px solid #ccc',
                    paddingBottom : '5px',
                    width : '90%',
                }}>
                    Update Email
                </h2>
                <br/>

                <FormControl sx={{m : 1, width : '40ch'}} style={{flexGrow : '1', margin : '8px 0'}} variant="outlined">
                    <TextField
                        required
                        id="signup-email"
                        type="email"
                        defaultValue={user.email || ''}
                        label="Email"
                        sx={{
                            '& .MuiOutlinedInput-root' : {
                                '& fieldset' : {
                                    //borderColor : emailError ? 'red' : 'grey',
                                },
                            },
                        }}
                        onChange={(e) => setEmail (e.target.value)}
                    />
                </FormControl>

                <Button variant="contained" /*onClick={() => registerUser ()}*/ sx={{backgroundColor : '#42A5F5', m : 1, width : '100%'}}>Update Email</Button>
            </div>

            <div className="Settings-Username">
                <h2 style={{
                    marginBottom : '-10px',
                    textAlign : 'center',
                    borderBottom : '2px solid #ccc',
                    paddingBottom : '5px',
                    width : '90%',
                }}>
                    Update Username
                </h2>
                <br/>

                <FormControl sx={{m : 1, width : '45ch'}} style={{flexGrow : '1', margin : '8px 0'}} variant="outlined">
                    <TextField
                        required
                        id="signup-username"
                        type="text"
                        label="Username"
                        defaultValue={user.username || ''}
                        sx={{
                            '& .MuiOutlinedInput-root' : {
                                '& fieldset' : {
                                    //borderColor : usernameError ? 'red' : 'grey',
                                },
                            },
                        }}
                        onChange={(e) => setUsername (e.target.value)}
                    />

                    <FormHelperText style={{textAlign : 'center'}}>
                        Usernames may include letters, numbers, and any special character except for the '@'
                        symbol.
                        Additionally, the username must have at least three characters long.
                    </FormHelperText>

                </FormControl>

                <Button variant="contained" /*onClick={() => registerUser ()}*/ sx={{backgroundColor : '#42A5F5', m : 1, width : '100%'}}>Update Username</Button>
            </div>
        </div>
    );
}