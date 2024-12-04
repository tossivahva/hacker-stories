import './App.css';
import * as React from 'react';
import { useEffect } from 'react';


const title = 'React';

// const profile = {
//     firstName: 'John',
//     lastName: 'Doe',
// };
//
// const adress = {
//     country: 'United States',
//     city: 'California',
// };
//
// const user = {
//     ...profile,
//     ...adress,
//     dog: 'Bob',
// };
//
// console.log(user);

const useStorageState = (key, initialState) => {
    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);
    
    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);
    
    return [value, setValue];
};


function App() {
    const stories = [
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
    
    // const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || 'React search');
    
    const [searchTerm, setSearchTerm] = useStorageState('search', 'Search here...');
    
    // React.useEffect(() => {
    //     localStorage.setItem('search', searchTerm);
    // }, [searchTerm]);
    
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        console.log(e.target.value);
    };
    
    const searchedStories = stories.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return (
        <div>
            <h1>Hello {title} + Vite!</h1>
            <Search search={searchTerm}
                    onSearch={handleSearch}/>
            <hr/>
            <List list={searchedStories}/>
        </div>
    );
}


const Search = ({ search, onSearch }) => {
    
    return (
        <div>
            <label htmlFor="search">{'Search: '}</label>
            <input id="search"
                   type="text"
                   value={search}
                   onChange={onSearch}
            />
            <p>
                Searching for: <strong>{search}</strong>
            </p>
        </div>
    );
};


const List = ({ list }) => {
    return (
        <ul>
            {list.map((item) => (
                <Item key={item.objectID}
                      item={item}/>
            ))}
        </ul>
    );
};

const Item = ({ item }) => {
    return (
        <li style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', gap: '5px' }}>
            <span>{item.title}</span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
        </li>
    );
    
};


export default App;
