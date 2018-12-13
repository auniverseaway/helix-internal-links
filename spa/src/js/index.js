import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import style from '../css/index.css';
import App from './App';

const admin = document.getElementById('admin');

if (admin) {
    ReactDOM.render(<App />, admin);
}
