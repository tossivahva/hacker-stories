import './App.css';
import * as React from 'react';
import axios from 'axios';
import {
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState,
} from 'react';


const title = 'React';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// const initialStories = [
//     {
//         title: 'React',
//         url: '/react',
//         author: 'Jordan Peterson',
//         num_comments: 3,
//         points: 4,
//         objectID: 0,
//     },
//     {
//         title: 'Vite',
//         url: '/vite',
//         author: 'Jack Black',
//         num_comments: 1,
//         points: 5,
//         objectID: 1,
//     },
// ];

const useStorageState = (key, initialState) => {
    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);
    
    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);
    
    return [value, setValue];
};


const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter((story) => action.payload.objectID !== story.objectID),
            };
        default:
            throw new Error();
    }
};


function App() {
    
    
    const [searchTerm, setSearchTerm] = useStorageState('search', '');
    const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false });
    
    const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
    
    const handleSearchInput = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const handleSearchSubmit = (e) => {
        setUrl(`${API_ENDPOINT}${searchTerm}`);
        e.preventDefault();
    };
    
    const handleFetchStories = useCallback(async () => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' });
        
        const result = await axios.get(url);
        try {
            dispatchStories({
                type: 'STORIES_FETCH_SUCCESS',
                payload: result.data.hits,
            });
        } catch {
            dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
        }
    }, [url]);
    
    useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);
    
    
    const handleRemoveStory = (item) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };
    
    return (
        <div>
            <h1>Hello {title} + Vite!</h1>
            <SearchForm
                searchTerm={searchTerm}
                onSearchInput={handleSearchInput}
                onSearchSubmit={handleSearchSubmit}
            />
            
            <hr/>
            
            {stories.isError && <p>Error</p>}
            
            {stories.isLoading ?
                (<p>Loading...</p>)
                : (
                    <List list={stories.data}
                          onRemoveItem={handleRemoveStory}
                    />
                )
            }
        </div>
    );
}

const SearchForm = ({ searchTerm, onSearchSubmit, onSearchInput }) => {
    return (
        <form onSubmit={onSearchSubmit}>
            <InputWithLabel id='search'
                            value={searchTerm}
                            isFocused
                            onInputChange={onSearchInput}
            >
                <strong>Search:</strong>
            </InputWithLabel>
            <button type='submit'
                    disabled={!searchTerm}
            >
                Submit
            </button>
        </form>
    );
};

const InputWithLabel = ({ id, children, type = 'text', value, onInputChange, isFocused }) => {
    
    const inputRef = useRef(null);
    
    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);
    
    return (
        <>
            <label htmlFor={id}>
                {children}
            </label>
            &nbsp;
            <input id={id}
                   ref={inputRef}
                   type={type}
                   value={value}
                   autoFocus={isFocused}
                   onChange={onInputChange}
            />
        </>
    );
};


const List = ({ list, onRemoveItem }) => {
    return (
        <ul>
            {list.map((item) => (
                <Item key={item.objectID}
                      item={item}
                      onRemoveItem={onRemoveItem}
                />
            ))}
        </ul>
    );
};

const Item = ({ item, onRemoveItem }) => {
    
    return (
        <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', gap: '5px' }}>
            <span>{item.title}</span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
                <button type='button'
                        onClick={() => onRemoveItem(item)}
                >
                    Remove
                </button>
            </span>
        </li>
    );
    
};


export default App;
