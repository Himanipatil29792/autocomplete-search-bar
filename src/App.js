import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const[input, setInput]=useState("");
  const[results, setResults]=useState([]);
  const[showResults, setShowResults]=useState(false); 
  const[cache, setCatche]=useState({});  // Clear catche

  const fetchData = async() =>{
    //Check if result already exists in cache (Not repeate to calls anything so use catche clear)
    if(cache[input]){
      console.log("Cache Returned", input);  // came from cache, no API call
      setResults(cache[input]);
      return;
    }

    console.log("API Call", input);
      const data=await fetch("https://dummyjson.com/recipes/search?q=" + input);
      const json=await data.json();
      setResults(json?.recipes);
      setCatche((prev) =>({...prev, [input]: json?.recipes}));
      //prev means the previous/current cache object
      //... means copy everything from previous cache
      // [input] is a dynamic key — uses the current search word as key
      // json?.recipes is the API result stored as value
  }

  useEffect(()=>{
    //Using this timer to reduced no of calls by using debouncing
    const timer=setTimeout(fetchData,300);
    return () =>{
      clearTimeout(timer);
    }
    //fetchData();
  },[input]);

   // Clear input and results
  const handleClear = () => {
    setInput("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="App">
      <h1>Autocomplete Search Bar</h1>
      <div className="search-box">
        <input type="text" className="search-input" placeholder="Search recipes..."
        value={input} 
        onChange={(e)=>setInput(e.target.value)} 
        onFocus={()=> setShowResults(true)}
        onBlur={()=> setShowResults(false)}
        />
         {input && (
            <button className="clear-btn" onClick={handleClear}>
              ✕
            </button>
          )}

        {showResults && (
        <div className="result-container">
          {results.map((r)=>
              <span className="result" key={r.id}>{r.name}</span>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

export default App;
