import FormControl  from '@mui/material/FormControl'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateDatasetList, updateQueryNameList, updateSavedQueryList, updateSelectedDatasetName, updateSelectedQuery, updateTheManualSparqlCode } from '@/redux/actions/Actions';
import { Autocomplete, TextField } from '@mui/material';
import {database} from '../../firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore/lite';


export default function QueryListDropDown() {
  
  const dispatch = useDispatch()

  const datasetNameList = useSelector(state=>state.datasetNames)
  const selectedDataset = useSelector(state=>state.selectedDataset)
  const queryNameList = useSelector(state=>state.queryNameList)


  const updateSelectedQueryInfo = (name)=>dispatch(updateSelectedQuery(name))
  const updateTheSelectedDatasetName = (name)=>dispatch(updateSelectedDatasetName(name))
  const updateTheDatasetList = (list)=>dispatch(updateDatasetList(list))
  const updateAllSavedQueryList = (list)=> dispatch(updateSavedQueryList(list))
  const updateTheQueryNameList = (list)=> dispatch(updateQueryNameList(list))
  const sparqlCodeUpdate = (code)=>{dispatch(updateTheManualSparqlCode(code))}

  const handleQueryNameChange = (event,value)=>{
    if(value!=null && value.length>0) updateSelectedQueryInfo(value)
  }

  const handleDatasetOptionChange = async (event, queryType) => {
    updateTheSelectedDatasetName(queryType)
    updateTheQueryNameList([''])
    sparqlCodeUpdate('')
    if(queryType!=null && queryType.length>0){

      console.log(queryType)

      const collectionOfQueryTypeList = collection(database,'BEdKG Dataset QueryType');
      const q = query(collectionOfQueryTypeList,where('queryType', '==', queryType));
      const querySnapshot = await getDocs(q);
      let savedQueryCollectionRef = ''
      querySnapshot.forEach((doc) => {
        savedQueryCollectionRef = 'BEdKG Dataset QueryType/'+doc.id+'/queries'
      });

      const queryList = collection(database,savedQueryCollectionRef);
      getDocs(queryList)
      .then((data) => {
          var queriesArray = data.docs.map((item) => {
              return { ...item.data(), id: item.id }
          });
          updateAllSavedQueryList(queriesArray)
          queriesArray  = queriesArray.map(item=>item.name)
          console.log(queriesArray)
          updateTheQueryNameList(queriesArray)
      })
    }
    else updateSelectedQueryInfo('newManualSparql')
  };


  useEffect(() => {
    const collectionOfDatasetCollectionList = collection(database, 'BEdKG Dataset QueryType');
    const GetDatasetNames = ()=>{
      getDocs(collectionOfDatasetCollectionList)
      .then((data) => {
          var tempDatasetNameList = data.docs.map((item) => {
              return { ...item.data()}
          });
          tempDatasetNameList = tempDatasetNameList.map((item)=> item.queryType)
          updateTheDatasetList(tempDatasetNameList)
      })
    }
    GetDatasetNames()
  }, [])



  return (
        <FormControl sx={{width:'70%',height:'50px',display:'flex',justifyContent:'space-between',flexDirection:'row',marginBottom:'8px' }}>
          
          <Autocomplete
           sx={{width:'49.5%'}}
            options={datasetNameList}
            onChange={handleDatasetOptionChange}
            renderInput={(params) => (
              <TextField {...params} label="Select Query Type" />
            )}
          />
          <Autocomplete
            disabled={selectedDataset==null || selectedDataset.length==0}
            sx={{width:'49.5%'}}
            onChange={handleQueryNameChange}
            options={queryNameList}
            renderInput={(params) => (
              <TextField {...params} label="Select a Query" />
            )}
          />
        </FormControl>
  )
}
