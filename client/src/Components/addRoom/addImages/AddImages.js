import React, {useCallback, useState} from 'react';
import {Paper} from "@mui/material";
import {useDropzone} from "react-dropzone";
import ProgressList from "./progressList/ProgressList";
import ImagesList from "./ImagesList";

const AddImages = () => {
    const [files, setFiles] = useState([]);
    const onDrop = useCallback((acceptedFiles) => {
        setFiles(acceptedFiles);
        console.log(acceptedFiles);
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {'image/*': []}
    })
    return (
        <>
            <Paper
                sx={{
                    cursor: 'pointer',
                    background: '#fafafa',
                    color: '#bdbdbd',
                    border: '1px dashed #ccc',
                    '&:hover': {border: '1px solid #ccc'}
                }}
            >
                <div style={{padding: '16px'}}  {...getRootProps()}>
                    <input {...getInputProps()}/>
                    {isDragActive ? (
                        <p style={{color: 'green'}}>Drop files here.</p>
                    ) : (
                        <p>Drag and drop some files here</p>
                    )}
                    <em>(Images with jpeg png are accepted)</em>
                </div>
            </Paper>
            <ProgressList {...{files}} />
            <ImagesList />
        </>
    );
};

export default AddImages;