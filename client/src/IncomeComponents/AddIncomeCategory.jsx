import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddCategory(){
    let navigate = useNavigate();

    let [category, setCategory] = useState({name: ""})
    
    function handleChange(event){
        setCategory({name: event.target.value})
    }

    function handleFormSubmit(event){
        event.preventDefault();

        axios.post("http://localhost:8080/income-categories", category)
        .then(() => {navigate("/income-list")})
        .catch((error) => {console.log(error)})
    }

    return(
        <form onSubmit={handleFormSubmit}>
            <label htmlFor="category">Category Name: </label>
            <input type="text" name="name" id="category" placeholder="Enter Category Name" onChange={handleChange} value={category.name}/>
            <button>Save</button>
        </form>
    )
}