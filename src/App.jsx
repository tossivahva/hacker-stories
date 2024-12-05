import './App.css';
import * as React from 'react';
import {
    useEffect,
    useReducer,
    useRef,
    useState,
} from 'react';


const title = 'React';

const initialStories = [
    {
        title: 'React',
        url: '/react',
        author: 'Jordan Peterson',
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: 'Vite',
        url: '/vite',
        author: 'Jack Black',
        num_comments: 1,
        points: 5,
        objectID: 1,
    },
];

const useStorageState = (key, initialState) => {
    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);
    
    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);
    
    return [value, setValue];
};

const getAsyncStories = () => {
    return new Promise((resolve) =>
        setTimeout(
            () => resolve({ data: { stories: initialStories } }),
            2000));
};

const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STORIES':
            return action.payload;
        case 'REMOVE_STORY':
            return state.filter((story) => action.payload.objectID !== story.objectID);
        default:
            throw new Error();
    }
};


function App() {
    
    
    const [searchTerm, setSearchTerm] = useStorageState('search', '');
    const [stories, dispatchStories] = useReducer(storiesReducer, []);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    
    
    useEffect(() => {
        setIsLoading(true);
        getAsyncStories().then(result => {
            dispatchStories({
                type: 'SET_STORIES',
                payload: result.data.stories,
            });
            setIsLoading(false);
        })
                         .catch(() => setIsError(true));
    }, []);
    
    const handleRemoveStory = (item) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };
    
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        console.log(e.target.value);
    };
    
    const searchedStories = stories.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return (
        <div>
            <h1>Hello {title} + Vite!</h1>
            <InputWithLabel id={'search'}
                            value={searchTerm}
                            isFocused
                            onInputChange={handleSearch}
            >
                <strong>Search:</strong>
            </InputWithLabel>
            <hr/>
            
            {isError && <p>Error</p>}
            
            {isLoading ?
                (<p>Loading...</p>)
                : (
                    <List list={searchedStories}
                          onRemoveItem={handleRemoveStory}
                    />
                )
            }
        </div>
    );
}

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
