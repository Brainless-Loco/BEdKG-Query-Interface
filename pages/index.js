import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Box from '@mui/material/Box';
import Menubar from '@/components/Menubar';
import QueryListDropDown from '@/components/homeComponent/QueryListDropDown';
import Button from '@mui/material/Button';
import Editor from '@/components/homeComponent/EditorComponent';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {setColumn, setResponseTime, setRows, updateHandleOpenStatus, updateLoadingTStatus, updateTheManualSparqlCode } from '@/redux/actions/Actions';
import ModalViewComponent from '@/components/homeComponent/ModalViewComponent';
import Link from 'next/link';
import Footer from '@/components/Footer/Footer';


export default function Home() {

  const dispach = useDispatch()

  //Reducer states
  const sparqlCode = useSelector(state=>state.sparqlCode)
  const modalOpenStatus = useSelector(state=>state.handleOpenStatus)
  const loading = useSelector(state=>state.loading)
  const responseTime = useSelector(state=>state.responseTime)
  const selectedQueryNam = useSelector(state=>state.selectedQueryName)

  //Reducer actions
  const updateLoadingStatus = ()=>dispach(updateLoadingTStatus())
  const updateModalStatus = ()=>dispach(updateHandleOpenStatus())
  const updateResponseTime = (time)=>dispach(setResponseTime(time))
  const updateRows = (rows)=> dispach(setRows(rows))
  const updateColumns = (columns)=> dispach(setColumn(columns))
  const updateSelectedQuery = (queryName) => dispach(updateSelectedQuery(queryName))
  const updateSparqlCodeFromClipboard = (code)=>dispach(updateTheManualSparqlCode(code))
  

  const executeQuery = async () => {
    if(loading) return
    updateModalStatus()
    updateLoadingStatus()
    
    const start = Date.now();
    const response = await axios.get('/api/execute_query', {
      params: {
        query: encodeURI(sparqlCode)
      }
    })
    const end = Date.now();
    const resTime = end - start;
    updateResponseTime(resTime)

    const cols = response.data.data.head.vars
    const bindings = response.data.data.results.bindings
    
    const checkLinkValidity = (link)=>{
      try {
        new URL(link);
        return true;
      } catch (err) {
        return false;
      }
    }

    // // Process the columns
    const tempCols = [{field: 'id', headerName: 'ID',  minWidth: 100,flex:0.1}]
    cols.map(item => {
      tempCols.push({field: item, headerName: item,renderCell: (params) => {
        const isLink = checkLinkValidity(params.value);
        if (isLink) {
          return (
            <a href={params.value} style={{color:'#020499'}} title={params.value} target="_blank" rel="noopener noreferrer">
              {params.value}
            </a>
          );
        } else {
          return <span>{params.value}</span>;
        }
      },  minWidth: 330, flex: 1})
    });
    updateColumns(tempCols)
    // // Process the Rows
    const tempRows = []
    bindings.map((item, idx) => {
        let obj = {id: idx}
        tempCols.map((c, index) => {
            if(index>0){
              obj = {...obj, [c.field]: item[c.field].value}
            }
        })
        tempRows.push(obj)
    });
    
    updateRows(tempRows)
    updateLoadingStatus()
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(sparqlCode);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  const pasteCode = async () => {
    try {
      const newCode = await navigator.clipboard.readText()
      updateSparqlCodeFromClipboard(newCode)
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }


  const buttonClasss = {
    backgroundColor:'#1d274f',color:'white',marginLeft:'20px',borderRadius:'5px',overflow:'hidden',paddingX:'25px',
    border:'2px solid transparent',fontWeight:'400',
    '&:hover': 
      {
      border:'2px solid #0d4d15',
      background: "white",
      color:'#0d4d15'
    }
  }

  return (
    <>
      <Head>
        <title>BEdKG Query Interface | BIKE</title>
        <meta name="description" content="A query interface for BEdKG by Tonmoy Chandro Das." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
          <Menubar title="BEdKG Query Interface"/>
          <Box sx={{width:'100%',padding:'8px',height:'auto',overflow:'hidden',display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            
            <QueryListDropDown/>
            <Box sx={{paddingRight:'8px'}}>
              <Link href="/insertQuery">
                <Button sx={buttonClasss}>Save New</Button>
              </Link>
              <Button sx={buttonClasss} onClick={copyCode}>Copy</Button>
              
              <Button sx={buttonClasss} onClick={pasteCode}>Paste</Button>
            </Box>
          </Box>
          <Editor/>
          <Box sx={{marginY:'10px',textAlign:'center'}}>
            <Button 
              disabled={selectedQueryNam.length==0}
              sx={{backgroundColor:'#0d4d15',width:'auto',padding:'14px',margin:'auto',color:'white',borderRadius:'5px',fontWeight:'bold',border:'2px solid transparent',
            '&:hover': 
                {
                border:'2px solid #0d4d15',
                background: "white",
                color:'#0d4d15'
              },
            }}
            onClick={executeQuery}
            
            >Run Query</Button>
            </Box>
          
          <Footer/>

      
       <Modal open={modalOpenStatus} onClose={updateModalStatus} sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{ width: '95vw', height: '95vh', backgroundColor: 'white', margin: 'auto', padding: '10px', borderRadius: '5px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',overflow:'auto' }}>
          <h3 style={{marginBottom:'10px'}}>Query Result ({responseTime ? `${responseTime} ms` : '-'})</h3>
          <ModalViewComponent/>
          <Box sx={{display:'flex',justifyContent:'center'}}>
            <Button variant="contained" color="primary" onClick={()=>{ updateResponseTime(0); updateModalStatus()}} style={{marginTop: '7px' }}>
              Close
            </Button>
          </Box>
          
        </div>
      </Modal>
          
      </main>
    </>
  )
}
