import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'

export default function Protected() {
    const isUser = useSelector(state => state.auth.status)

    return isUser ? <Outlet /> : <Navigate to={'/login'} />;
}