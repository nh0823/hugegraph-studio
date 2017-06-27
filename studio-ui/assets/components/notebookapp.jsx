/**
 * @file Desciption:
 * @author huanghaiping(huanghaiping02@baidu.com)
 * Created on 17/6/12
 */
import '../vendors/bootstrap/css/bootstrap.min.css';
import '../css/main.css';
import React from 'react';
import Head from './head';
import NotebookBoard from './notebook/notebookboard';
import StudioHead from './studiohead';
import 'whatwg-fetch';
import {connect} from 'react-redux';
import {itemScreenMode} from './notebook/actions';

class NotebookApp extends React.Component {
    constructor() {
        super();

        this.studioHeadName = this.getNoteCardName().name;
        this.notebookId = this.getNoteCardName().id;


    }

    getNoteCardName = () => {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    render() {
        return (
            <div>
                <Head
                    fluid={this.props.screenMode.fullScreen}/>
                <StudioHead
                    display={this.props.screenMode.fullScreen ? 'none' : 'block'}
                    name={this.studioHeadName}/>
                <NotebookBoard notebookId={this.notebookId}/>
            </div>
        );
    }
}


// Map Redux state to component props
function mapStateToProps(state) {
    return {
        screenMode: state.screenMode
    };
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return {
        itemScreenMode: (flag, itemKey) => dispatch(itemScreenMode(flag, itemKey))
    };
}

// Connected Component
export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(NotebookApp);