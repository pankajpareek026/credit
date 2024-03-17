import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom'
export default function Private() {
    const isUser = useSelector(state => state.auth.status)
    return !isUser ? <Outlet /> : <Navigate to={'/'} />
}