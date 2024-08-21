import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

const UrlData = ({ item }) => {
    return (
        <Card sx={{ maxWidth: '30%', overflowY: 'scroll'}}>
            <CardMedia
                component="img"
                height="30%"
                image={item.image}
                alt={item.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {item.title}
                </Typography>
                <Typography variant="body2" color="text.primary">
                    {item.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default UrlData;
