import React, {Component} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import {connect} from 'react-redux';
import {addUrl} from '../actions/urlActions';
import PropTypes from 'prop-types';

class UrlModal extends Component {
    state = {
        modal: false,
        url: ''
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const newUrl = {
            url: this.state.url
        };

        this.props.addUrl(newUrl);

        this.toggle();
    };

    render() {
        return (
            <div>
                {this.props.isAuthenticated ? (
                    <Button
                        color='dark'
                        style={{ marginBottom: '2rem' }}
                        onClick={this.toggle}
                    >
                        Add url
                    </Button>
                ) : (
                    <h4 className='mb-3 ml-4'>Please login to manage urls</h4>
                )}

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add url to list</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for='url'></Label>
                                <Input
                                    type='text'
                                    name='url'
                                    id='url'
                                    placeholder='Add url'
                                    onChange={this.onChange}
                                />
                                <Button color='dark' style={{marginTop: '2rem'}} block>
                                    Add url
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    url: state.url,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(
    mapStateToProps,
    { addUrl }
)(UrlModal);
