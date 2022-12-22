import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function Protected() {
    const Isuser = localStorage.getItem('user')
    return Isuser ? <Outlet /> : <Navigate to={'/login'} />;
}