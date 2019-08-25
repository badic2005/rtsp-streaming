import React, {Component} from 'react';
import AppNavbar from './components/AppNavbar';
import UrlModal from './components/UrlModal';
import {Container} from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// import jsmpeg from 'jsmpeg';
import UrlsList from './components/UrlsList';

import {Provider} from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

class App extends Component {

    // player = null;

    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <AppNavbar></AppNavbar>
                    <Container>
                        <UrlModal></UrlModal>
                        <UrlsList></UrlsList>
                    </Container>
                </div>
            </Provider>
        );
    }
}

export default App;
