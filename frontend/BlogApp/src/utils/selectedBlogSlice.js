import {createSlice } from "@reduxjs/toolkit";

const selectedBlogSlice= createSlice({
    name:"selectedBlogSlice",
    initialState:JSON.parse(localStorage.getItem("selectedBlog")) || {},
    reducers:{
        addSelectedBlog(state,action){
                localStorage.setItem("selectedBlog",JSON.stringify(action.payload))
            return action.payload;
        },
        removeSelectedBlog(state,action){
            localStorage.removeItem("selectedBlog");
            return {};
        },
        changeLikes(state,action){
            // console.log("Hello")
            if(state.likes.includes(action.payload)){
                // console.log("Hello1")
                state.likes=state.likes.filter(like=>like!=action.payload);
            }
            else{
                // console.log("Hello2")
                state.likes=[...state.likes,action.payload];
            }
            return state;
        },

        setComments(state,action){
            console.log(action.payload)
            state.comments=[...state.comments,action.payload];
        }
    }
})
export const {addSelectedBlog,removeSelectedBlog,changeLikes,setComments}=selectedBlogSlice.actions;
export default selectedBlogSlice.reducer;