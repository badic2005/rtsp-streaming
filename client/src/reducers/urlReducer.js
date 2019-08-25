import {GET_URLS, ADD_URL, DELETE_URL, PLAY_URL, STOP_URL, URLS_LOADING} from "../actions/types";

const initialState = {
    urls: [],
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_URLS:
            return {
                ...state,
                urls: action.payload,
                loading: false
            };
        case DELETE_URL:
            return  {
                ...state,
                urls: state.urls.filter(url => url._id !== action.payload)
            };
        case ADD_URL:
            return  {
                ...state,
                urls: [action.payload, ...state.urls]
            };
        case PLAY_URL:
            return  {
                ...state,
                urls: state.urls.map((data) => {
                    if(data.url === action.payload.streamUrl) {
                        return {
                            ...data,
                            wsPort: action.payload.wsPort,
                            "streaming": true
                        }
                    } else {
                        return {
                            ...data
                        }
                    }
                })
            };
        case STOP_URL:
            return  {
                ...state,
                urls: state.urls.map((data) => {
                    if(data._id === action.payload.urlId) {
                        return {
                            ...data,
                            wsPort: null,
                            "streaming": false
                        }
                    } else {
                        return {
                            ...data
                        }
                    }
                })
            };
        case URLS_LOADING:
            return  {
                ...state,
                loading: true
            };
        default:
            return state;
    }

}
