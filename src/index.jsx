import React from 'react'
import "./App.css";
import HomePage from './components/homepage.jsx';
import { Outlet } from 'react-router-dom';
function Index() {
  return (
    <>
    <HomePage />
    <Outlet />
    </>
  )
}

export default Index