import { UPDATE_LOADING_TIME, UPDATE_HANDLE_OPEN_STATE, SET_ROWS, SET_DATA, SET_RESPONSE_TIME, SET_COLUMNS, UPDATE_SELECTED_QUERY, UPDATE_ALL_SAVED_QUERY_LIST, UPDATE_SPARQL_WITH_NON_SELECTION_MANUALLY_WRITTEN_CODE, UPDATE_MANUAL_WRITING_STATUS, UPDATE_SELECTED_DATASET_NAME, UPDATE_DATASET_LIST, UPDATE_QUERY_NAME_LIST } from "../Types";

const initialState = {
    loading:false,
    sparqlCode:
    `# Please Select a Query Type First
            
            # You can go to /insertQuery to save your query
    `,
    handleOpenStatus:false,
    data:[],
    rows:[],
    columns:[],
    responseTime:0,
    queries:[],
    queryNameList:[],
    datasetNames:[],
    selectedDataset:'',
    selectedQueryName: '',
    manualWritingState:false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_LOADING_TIME:{
            return{
                ...state,
                loading: !state.loading
            }
        }
        case UPDATE_HANDLE_OPEN_STATE:{
            return{
                ...state,
                handleOpenStatus:!state.handleOpenStatus
            }
        }
        case SET_DATA:{
            return{
                ...state,
                data:action.data
            }
        }
        case SET_RESPONSE_TIME:{
            return{
                ...state,
                responseTime:action.time
            }
        }
        case SET_ROWS:{
            return{
                ...state,
                rows:action.rows
            }
        }
        case SET_COLUMNS:{
            return{
                ...state,
                columns:action.columns
            }
        }

        case UPDATE_SELECTED_QUERY:{
            var temp;
            if(action.queryName==="newManualSparql") temp =  `# Please Select a Query Type First

            # You can go to /insertQuery to save your query`
            else {
                temp = state.queries.filter(query=>query.name===action.queryName)
                temp = temp[0].query
            }
            return {
                ...state,
                sparqlCode: temp,
                selectedQueryName: action.queryName,
                manualWritingState:false
            }
        }
        
        case UPDATE_ALL_SAVED_QUERY_LIST:{
            return{
                ...state,
                queries:action.list
            }
        }

        case UPDATE_SPARQL_WITH_NON_SELECTION_MANUALLY_WRITTEN_CODE:{
            return{
                ...state,
                sparqlCode:action.code
            }
        }

        case UPDATE_MANUAL_WRITING_STATUS:{
            return{
                ...state,
                manualWritingState:action.value
            }
        }
        case UPDATE_SELECTED_DATASET_NAME:{
            return{
                ...state,
                selectedDataset:action.name
            }
        }

        case UPDATE_DATASET_LIST:{
            return{
                ...state,
                datasetNames:action.list
            }
        }
        
        case UPDATE_QUERY_NAME_LIST:{
            return{
                ...state,
                queryNameList:action.list
            }
        }








        default:{
        return state;
        }
    }
};