import React, {Component} from 'react';
import {Container, ListGroup, ListGroupItem, Button} from 'reactstrap';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import {connect} from 'react-redux';
import {getUrls, deleteUrl, playUrl, stopUrl} from '../actions/urlActions';
import PropTypes from 'prop-types';
import jsmpeg from 'jsmpeg';

class UrlsList extends Component {

    state = {
        streamingUrls: []
    };

    static propTypes = {
        getUrls: PropTypes.func.isRequired,
        url: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool
    };

    componentDidMount() {
        this.props.getUrls();
    }

    componentWillUnmount() {
        this.state.streamingUrls.forEach((data => {
            this.props.stopUrl({urlId: data.id});
        }));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.props.url.urls.forEach((data) => {
            if (data.streaming) {
                debugger
                let alreadyStreaming = false;
                if(this.state.streamingUrls.forEach((streaming_data) => {
                    if(streaming_data.id === data._id && streaming_data.port === data.wsPort) {
                        alreadyStreaming = true;
                    }
                }));

                if(!alreadyStreaming) {
                    setTimeout(() => {
                        this.player = new jsmpeg(new WebSocket(this.getWsUrl(data.wsPort)), {
                            canvas: document.getElementById('canvas_' + data._id),
                            autoplay: true,
                            audio: false,
                            loop: true,
                        });

                    }, 4000);

                    this.setState(state => ({
                        streamingUrls: [...state.streamingUrls, {
                            id: data._id,
                            port: data.wsPort,
                            player: this.player
                        }]
                    }))
                }
            }
        });
    }

    onDeleteClick = id => {
        this.props.deleteUrl(id);
    }

    onPlayClick = id => {
        this.props.playUrl({urlId: id});
    }

    onStopClick = id => {
        this.props.stopUrl({urlId: id});
        this.setState(state => ({
            streamingUrls: state.streamingUrls.filter(data => {
                return data.id !== id
            })
        }))
    }

    getWsUrl(wsPort) {
        return (window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.hostname + ":" + wsPort;
    }

    render() {
        const {urls} = this.props.url;
        return (
            <Container>
                <ListGroup>
                    <TransitionGroup>
                        {urls.map(({_id, url, streaming, wsPort}) => (
                            <CSSTransition key={_id} timeout={500} classNames='fade'>
                                <ListGroupItem>
                                    {this.props.isAuthenticated ? (
                                        <div>
                                            <Button
                                                className='play-btn'
                                                color='primary'
                                                size='sm'
                                                disabled={streaming}
                                                onClick={this.onPlayClick.bind(this, _id)}
                                            >
                                                Play
                                            </Button>
                                            <Button
                                                className='stop-btn'
                                                color='primary'
                                                size='sm'
                                                disabled={!streaming}
                                                onClick={this.onStopClick.bind(this, _id)}
                                            >
                                                Stop
                                            </Button>
                                            <Button
                                                className='remove-btn'
                                                color='danger'
                                                size='sm'
                                                onClick={this.onDeleteClick.bind(this, _id)}
                                            >
                                                &times;
                                            </Button>
                                            {url}
                                        </div>
                                    ) : null}
                                    {streaming ? (
                                        <div>
                                            <canvas className="camera" id={'canvas_' + _id} width="640"
                                                    height="360"></canvas>
                                        </div>
                                    ) : null}
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
            </Container>
        );
    }
}

UrlsList.prototypes = {
    getUrls: PropTypes.func.isRequired,
    url: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    url: state.url,
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {
    getUrls,
    deleteUrl,
    playUrl,
    stopUrl
})(UrlsList);
