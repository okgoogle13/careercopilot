import React from 'react';
import { NavLink } from 'react-router-dom';

const activeLinkStyle = {
    color: 'white',
    textDecoration: 'underline',
};

const Navbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <NavLink to="/" className="font-bold text-xl">CareerPilot</NavLink>
                <div className="flex gap-4 items-center">
                    <NavLink to="/" className="text-gray-300 hover:text-white" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>
                    <NavLink to="/documents" className="text-gray-300 hover:text-white" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>My Documents</NavLink>
                    <NavLink to="/opportunities" className="text-gray-300 hover:text-white" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Opportunities</NavLink>
                    <NavLink to="/ksc-generator" className="text-gray-300 hover:text-white" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>KSC Generator</NavLink>
                    <NavLink to="/settings" className="text-gray-300 hover:text-white" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Settings</NavLink>
                    <NavLink to="/analysis" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        AI Analysis
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
