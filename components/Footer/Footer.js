import React from 'react'
import Box from '@mui/material/Box';
import  Typography  from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box sx={{width:"100%",backgroundColor:'#1d274f',padding:'15px',height:"30px",color:'white',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <Typography variant="h6" sx={{fontWeight:'bold',fontFamily:'monospace',verticalAlign:'center',paddingTop:'6px'}} gutterBottom>
            Made by <a href='https://www.linkedin.com/in/-tonmoy-das-/'> Brainless Loco</a>
        </Typography>
    </Box>
  )
}
