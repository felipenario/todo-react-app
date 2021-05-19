import React, {useEffect, useState} from 'react';
import axios from 'axios'

import PageHeader from '../template/PageHeader';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const URL = 'http://localhost:3003/api/todos'

export default function Todo(props) {
    const [description, setDescription] = useState('')
    const [list, setList] = useState([])
    
    function refresh(description = '') {
        const search = description ? `&description__regex=/${description}/` : ''
        axios.get(`${URL}?sort=-createdAt${search}`)
            .then(response => {
                setList(response.data)
                setDescription(description)
            })
    }
    
    function handleSearch() {
        refresh(description)
    }

    function handleChange(e) {
        setDescription(e.target.value)
    }
    
    function handleAdd() {
        axios.post(URL, {description})
            .then(() => refresh())
    }

    function handleRemove(todo) {
        axios.delete(`${URL}/${todo._id}`)
            .then(response => refresh(description))
    }

    function handleMarkAsDone(todo) {
        axios.put(`${URL}/${todo._id}`, {...todo, done: true})
            .then(() => refresh(description))
    }

    function handleMarkAsPending(todo) {
        axios.put(`${URL}/${todo._id}`, {...todo, done: false})
            .then(() => refresh(description))
    }

    function handleClear() {
        refresh()
    }

    useEffect(() => {
        refresh()
    }, [])

    return (
        <div>
            <PageHeader name='Tarefas' small='Cadastro'/>
            <TodoForm description={description} handleChange={handleChange} handleAdd={handleAdd} handleSearch={handleSearch} handleClear={handleClear}/>
            <TodoList list={list} handleRemove={handleRemove} handleMarkAsDone={handleMarkAsDone} handleMarkAsPending={handleMarkAsPending}/>
        </div>
    )
}