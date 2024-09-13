import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Menubar from '@/components/Menubar';
import Button from '@mui/material/Button';
import {database} from '../../firebaseConfig'
import { addDoc, collection, doc, getDocs, query, where } from 'firebase/firestore/lite';
import {useEffect} from 'react'
import { Editor } from '@monaco-editor/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDatasetList } from '@/redux/actions/Actions';
import Footer from '@/components/Footer/Footer';


const MyFormComponent = () => {

  const [queryType, setqueryType] = useState('');
  const [nameValue, setnameValue] = useState('')
  const [editorValue, seteditorValue] = useState('#Write your SPARQL Code Here')


  const dispatch = useDispatch()

  
  const queryTypeList = useSelector(state=>state.datasetNames)

  const updateTheDatasetList = (list)=>dispatch(updateDatasetList(list))


  const handleDatasetOptionChange = (event, value) => {
    if(value!=null && value.length>0) setqueryType(value);
  };
  const handleChangeOfqueryType = (event)=>{
    setqueryType(event.target.value)
  }
  const editorValueUpdate = (value,event)=>{
    seteditorValue(value)
  }


  const insertData = async () => {
    const collectionOfDatasetCollectionList = collection(database,'BEdKG Dataset QueryType');
    const q = query(collectionOfDatasetCollectionList,where('queryType', '==', queryType));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const docRef = await addDoc(collectionOfDatasetCollectionList,{'queryType':queryType});
      const collectionRef = collection(database,'BEdKG Dataset QueryType/'+docRef.id+'/queries');
      addDoc(collectionRef,{'name':nameValue,'query':editorValue});
    }
    else{
      querySnapshot.forEach((doc) => {
        const collectionRef = collection(database,'BEdKG Dataset QueryType/'+doc.id+'/queries');
        addDoc(collectionRef,{'name':nameValue,'query':editorValue});
      });
    }

    setqueryType('');
    seteditorValue('');
    setnameValue('')
    GetqueryTypes()

    

  };

  // Firebase Works
  const collectionOfDatasetCollectionList = collection(database, 'BEdKG Dataset QueryType');
  const GetqueryTypes = ()=>{
    getDocs(collectionOfDatasetCollectionList)
    .then((data) => {
        var tempqueryTypeList = data.docs.map((item) => {
            return { ...item.data()}
        });
        tempqueryTypeList = tempqueryTypeList.map((item)=> item.queryType)
        updateTheDatasetList(tempqueryTypeList)
    })
  }

  useEffect(() => {
    
    GetqueryTypes()
  }, [])



  return (
    <>
      <Head>
        <title>Save Query | BEdKG</title>
        <meta name="description" content="Interface to save a query for execution on BEdKG by Tonmoy Chandro Das." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
          <div style={{display:'flex',justifyContent:'center',marginBottom:'5px'}}>
              <Menubar title="Save A Query on BEdKG"/>
          </div>
          <Box sx={{width:'100%',padding:'8px',height:'auto',overflow:'hidden',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <Autocomplete
              options={queryTypeList}
              value={queryType}
              onChange={handleDatasetOptionChange}
              freeSolo
              sx={{width:'49.5%'}}
              renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select a Query Type"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChangeOfqueryType}
                  />
                )}
            />
            <TextField value={nameValue} onChange={(newValue)=>{setnameValue (newValue.target.value)}} sx={{width:'49.5%'}} id="name-of-the-query" label="Name" variant="outlined" />
          </Box>
          <div style={{margin:'8px',marginTop:'2px',height:'68vh',border:'1px solid gray',borderRadius:'8px',overflow:'hidden',}}>
              <Editor defaultLanguage='sparql' value={editorValue} onChange={editorValueUpdate}/>
          </div>
          <div style={{display:'flex',justifyContent:'center',marginBottom:'5px'}}>
              <Button
                  disabled={!nameValue.length || !editorValue.length || !queryType.length}
                  onClick={insertData}
                  sx={{backgroundColor:'#0d4d15',width:'150px',padding:'14px',margin:'auto',color:'white',borderRadius:'5px',fontWeight:'bold',border:'2px solid transparent',
                  '&:hover': 
                      {
                      border:'2px solid #0d4d15',
                      background: "white",
                      color:'#0d4d15'
                      },
                  }}>Submit</Button>
          </div>
          <Footer/>
          {/* {loading && <Box sx={{ zIndex:'5', position:'absolute',top:'0%',backdropFilter: 'blur(5px)', width:'100%', display: 'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'100%' }}>
            <h2>Saving the Query</h2><br/>
            <CircularProgress />
          </Box>}
           */}
      </Box>
    </>
  );
};

export default MyFormComponent;
