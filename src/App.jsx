import './App.css';
import * as React from 'react';


const title = 'React';


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
    const [searchTerm, setSearchTerm] = React.useState('');
    
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        
        console.log(e.target.value);
    };
    
    const searchedStories = stories.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
        <div>
            <h1>Hello {title} + Vite!</h1>
            <Search onSearch={handleSearch}/>
            <hr/>
            <List list={searchedStories}/>
        </div>
    );
}


const Search = (props) => {
    
    return (
        <div>
            <label htmlFor="search">{'Search: '}</label>
            <input id="search"
                   type="text"
                   value={props.onSearch.value}
                   onChange={props.onSearch}
            />
            <p>
                Searching for: <strong>{props.onSearch.value}</strong>
            </p>
        </div>
    );
};


const List = (props) => {
    return (
        <ul>
            {props.list.map(item => (
                <Item key={item.objectID}
                      item={item}/>
            ))}
        </ul>
    );
};

const Item = (props) => {
    return (
        <li key={props.item.objectID}
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', gap: '5px' }}>
            <span>{props.item.title}</span>
            <span>{props.item.author}</span>
            <span>{props.item.num_comments}</span>
            <span>{props.item.points}</span>
        </li>
    );
    
};


export default App;
