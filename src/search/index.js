'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import '../../common';
import './index.less';
import logo from './images/logo.jpg'


class Search extends React.Component {
    render(){
        debugger;
        return <div className="search-text">
            search text  hello webpack awesome
            <img src={logo} alt=""/>

        </div>
    }
}
ReactDOM.render(
    <Search/>,
    document.getElementById('root')
)

