import React from 'react';
import Sidebar from './components/Sidebar';
import Footer from "./components/Footer";
import Chatbox from './components/Chatbox';

export default function App() {
  return (
    <div className="h-screen flex">
      {/* <Sidebar className="w-1/4" /> */}
      <div className="flex-1 flex justify-center items-center p-4">
        <Chatbox />
      </div>
    </div>
  );
}
