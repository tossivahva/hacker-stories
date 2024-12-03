import './App.css';
import * as React from 'react';


const title = 'React';

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


function App() {
    
    const handleSearch = (e) => {
        console.log(e.target.value);
    };
    
    return (
        <div>
            <h1>Hello {title} + Vite!</h1>
            <Search onSearch={handleSearch}/>
            <hr/>
            <List list={stories}/>
        </div>
    );
}


const Search = (props) => {
    
    const [searchTerm, setSearchTerm] = React.useState('');
    
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        props.onSearch(e);
    };
    
    return (
        <div>
            <label htmlFor="search">{'Search: '}</label>
            <input id="search"
                   type="text"
                   value={searchTerm}
                   onChange={handleChange}
            />
            <p>
                Searching for: <strong>{searchTerm}</strong>
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
        <li key={props.item.objectID}>
            <span>{props.item.title}</span>
            <span>{props.item.author}</span>
            <span>{props.item.num_comments}</span>
            <span>{props.item.points}</span>
        </li>
    );
    
};


export default App;
