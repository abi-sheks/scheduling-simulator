import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import MainScreen from './components/MainScreen'
import Workload from './components/Workload';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ComparisonDashboard from './components/ComparisonDashboard';

const router = createBrowserRouter([
  {
    path : "/",
    element : <MainScreen />,
    children : [
      {
        path : "/",
        element : <Workload />
      },
      {
        path : "/comparison",
        element : <ComparisonDashboard />
      }
    ]
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <RouterProvider router={router}/>
);