import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchFields from "./StockList_Components/SearchFields";
import React, {useState} from "react";
import Button from "@mui/material/Button";

export default function Portfolio({token, user}) {

    const [orderBy, setOrderBy] = useState("Newest"); // When orderBy updates
    const [currentSector, setSectors] = useState(""); // For filtering sectors from stocks
    const [searchBarInput, setSearchBar] = useState(""); // For filtering using the search bar

    return (
        <div className="Portfolio">
            <div className="StockList-Header">

                {/*** Search options ***/}
                <div className="StockList-Sector-OrderBy-Left">
                    {/* Sectors */}
                    <FormControl className="StockList-Sector" variant="filled" sx={{m : 0, minWidth : 270}}>
                        <InputLabel id="StockList-Sector">Sectors</InputLabel>
                        <Select
                            labelId="StockList-Sector"
                            id="StockList-Sector"
                            value={currentSector}
                            onChange={(event) => setSectors (event.target.value)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>

                            {/*generateSectorItems ()*/}

                        </Select>
                    </FormControl>

                    {/* Order By */}
                    <FormControl className="StockList-OrderBy" variant="filled" sx={{m : 0, minWidth : 270}}>
                        <InputLabel id="StockList-OrderBy">Order By</InputLabel>
                        <Select
                            labelId="StockList-OrderBy"
                            id="StockList-OrderBy"
                            value={orderBy}
                            onChange={(event) => setOrderBy (event.target.value)}
                        >
                            <MenuItem value={"Newest"}>Newest</MenuItem>
                            <MenuItem value={"Oldest"}>Oldest</MenuItem>
                            <MenuItem value={"Updated"}>Updated</MenuItem>
                            <MenuItem value={"Percent Change"}>Percent Change (high-to-low)</MenuItem>
                            <MenuItem value={"Price Low"}>Price (low-to-high)</MenuItem>
                            <MenuItem value={"Price High"}>Price (high-to-low)</MenuItem>
                            <MenuItem value={"Market Low"}>Market Value (low-to-high)</MenuItem>
                            <MenuItem value={"Market High"}>Market Value (high-to-low)</MenuItem>
                            <MenuItem value={"Percent Low"}>Percent Change (low-to-high)</MenuItem>
                            <MenuItem value={"Percent High"}>Percent Change (high-to-low)</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className="StockList-Search-Center">
                    <TextField
                        className="StockList-Search"
                        id="filled-search"
                        label="Search"
                        type="search"
                        variant="filled"
                        value={searchBarInput}
                        onChange={(event) => setSearchBar (event.target.value)}
                        sx={{minWidth : '350px'}}
                    />
                </div>

                <div className="StockList-SearchFields">
                    <div className='StockList-Right-Space'/>
                    <SearchFields/>
                </div>

            </div>

            <div className="Portfolio-Footer">
                <Button variant="contained" sx={{backgroundColor: '#f8f9fa', color: 'black', minWidth: '163px'}}>
                    Generate Report
                </Button>
            </div>

        </div>
    );
}