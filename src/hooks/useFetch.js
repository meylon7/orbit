import { useState, useEffect } from 'react'
import axios from 'axios'
import sysIPAddress from './location'
const headers = {
    'Access-Control-Origin': '*'
    //'Content-Type': 'text/plain',
};

export const useFetchPost = (url, PostValue, initVal) => {
    const [result, setResult] = useState(initVal)

    useEffect(()=>{
        axios
            .post("https://" + sysIPAddress + url, PostValue,{headers})      
            .then(response => response.json())
            .then(json => setResult(json))
    },[])

    return result
}

export const useFetchGet = (url, token, initVal) => {
    const [result, setResult] = useState(initVal)

    useEffect(()=>{
        axios
            .get("https://" + sysIPAddress + url, {
                    headers: {
                    Authorization: "Bearer " + token,
                },mode:'cors'
                })      
                .then(response => response.json())
                .then(json => setResult(json))
    },[])

    return [{result}]
}