import React from 'react'
import { Outlet,Navigate } from 'react-router-dom'
export default function Private()
{const Isuser=localStorage.getItem('user')
    return  !Isuser?<Outlet/>:<Navigate to={'/'}/>
}