import {
    Grid, Card, CardContent, Typography, CardActionArea, FormControl, InputLabel, MenuItem,
    IconButton
} from '@mui/material';

import CardMedia from '@mui/material/CardMedia';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SampleUtils } from '../Utils/SampleUtils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export const SampleWizard = (props: any) => {
    const sampleUtils = new SampleUtils(resourcesPath);
    const typesArray = sampleUtils.getTypes();
    const [category, setCategory] = useState("All");
    const [cardData, setCardData] = useState<any[]>([]);
    const [cardDataCopy, setCardDataCopy] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedSample, setSelectedSample] = useState("Hello World Service");
    const [error, setError] = useState(false);
    const [projectName, setProjectName] = useState("");

    // Get folders in the workspace
    window.postMessage({ type: 'getWorkspaceFolders' }, '*');

    useEffect(() => {
        var tmpCardData = sampleUtils.getAllSamples();
        setCardData(tmpCardData);
        setCardDataCopy(tmpCardData);
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: SelectChangeEvent) => {
        var selectedCategory = event.target.value as string;
        setCategory(selectedCategory);
        selectedCategory = selectedCategory.replace(' ', '_');
        setCardData(sampleUtils.getFilteredSampleList(selectedCategory));
        setCardDataCopy(sampleUtils.getFilteredSampleList(selectedCategory));
    };

    const handleSearch = (event: any) => {
        var searchValue = event.target.value as string;
        setCardData(sampleUtils.getFilteredSampleListBySearch(cardDataCopy, searchValue));
    };

    const handleCardClick = (sample: string) => (event: any) => {
        setSelectedSample(sample);
        handleClickOpen();
    };

    const handleCreateSample = (event: any) => {
        vscodeReference.postMessage({
            "command": "CreateNewSample",
            "SampleName": projectName,
            "SampleType": selectedSample
        });
        handleClose();
    };

    const handleProjectNameChange = (event: any) => {
        var fileName = event.target.value as string;
        setProjectName(fileName);
        setError(false);
        // casting to avoid errors
        const folders = workspaceFolders.split(',') as string[];
        folders.forEach(element => {
            if (element === fileName) {
                setError(true);
                return;
            }
        });
    };

    return (
        <>
            <h3>Try out a Sample</h3>
            <p>Select a sample and follow the instructions to get started</p>
            <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={category}
                            label="All"
                            size="small"
                            onChange={handleChange}
                        >
                            {typesArray.map((option, index) => (
                                <MenuItem value={option}>
                                    {option}
                                </MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    <Paper
                        sx={{ display: 'flex', width: '100%', height: '100%' }}>
                        <IconButton size="small" type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search by sample name"
                            inputProps={{ 'aria-label': 'search google maps' }}
                            onChange={handleSearch}
                            size="small"
                        />
                    </Paper>
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
                {cardData?.map((item: any, index: any) => (

                    <Grid item xs={6} sm={3} md={3} lg={2} xl={1} key={index}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardActionArea onClick={handleCardClick(item.title)}>
                                <CardMedia
                                    component="img"
                                    height="70"
                                    image={item.icon}
                                    sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
                                />
                                <CardContent
                                    sx={{ maxHeight: 100, overflow: "auto" }}
                                >
                                    <Typography gutterBottom variant="h6" component="div">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create Sample</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create {selectedSample} Sample
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Project Name"
                        type="text"
                        error={error}
                        helperText={error ? 'Project with the name ' + projectName + ' already exists' : ''}
                        fullWidth
                        variant="standard"
                        onInput={handleProjectNameChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreateSample}>Create</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
