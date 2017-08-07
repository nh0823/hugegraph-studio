/**
 * @file Desciption:
 * @author huanghaiping(huanghaiping02@baidu.com)
 * Created on 17/7/29
 */

import React from 'react';
import {connect} from 'react-redux';
import {updateItem, executeCell, deleteItem} from './actions';
import {changeHeadMode} from '../actions';
import ChangeButton from '../commoncomponents/changebutton';
import DropDownMenu from '../commoncomponents/dropdownmenu';
import CardEditor from "./cardedior";
import CellResult from "./cellresult";
import CardFooter from "./cardfooter";

const initPanelHeight = 1;
const initCardContentHeight = 200;
const headHeight = 32;
const pannelbodyPadding = 18;
const cardHeadHeight = 40;
const cardEditorHeight = 48;
const cardContentToolbox = 30;
const footer = 25;
const cardContentPadding = 10;
const cardContentBottomMargin = 8;

export const Gremlin = 'Gremlin';
export const Markdown = 'Markdown';
export const GremlinMode = 'ace/mode/gremlin';
export const MarkdownMode = 'ace/mode/markdown';
export const languageItem = [Gremlin, Markdown];

class NotebookCell extends React.Component {

    constructor() {
        super();
        this.state = {
            exist: true
        }
    }

    componentWillUnmount() {
        if (this.state.exist) {
            this.updateCell();
        }
    }

    render() {
        let cell = this.props.cell;
        let deleteBtnCss = this.props.canBeDelete ? 'btn btn-link' : 'btn btn-link  disabled';
        let screenContainer = cell.viewSettings.fullScreen ? 'container-fluid' +
            ' full-screen' : 'container';
        let screenCol = cell.viewSettings.fullScreen ? 'col-md-12 full-screen-col-md-12' : 'col-md-12';
        let display = cell.viewSettings.view ? 'block' : 'none';
        let panelHeight = this.computeHeight();
        panelHeight = cell.viewSettings.fullScreen ? panelHeight + 'px' : '1px';
        let cardContentHeight = this.cardContentHeight(cell.viewSettings.fullScreen, cell.viewSettings.view);
        let cellResultClass = {
            'height': cardContentHeight,
            'markdownHeight': cardContentHeight + cardContentToolbox + cardContentPadding
        };

        let deleteBtnDisplay = (cell.viewSettings.fullScreen || !cell.viewSettings.view ) ? 'none' : 'block';


        let language = cell.language.toLowerCase().replace(/[a-z]/, (L) => L.toUpperCase());

        return (
            <div className={screenContainer}>
                <div className="row card">
                    <div className={screenCol}>
                        <div className="panel panel-default"
                             style={{minHeight: panelHeight}}>
                            <div className="panel-body">
                                <div className="card-header">
                                    <div className="pull-left"
                                         style={{display: display}}>
                                        <DropDownMenu id={cell.id}
                                                      initItem={language}
                                                      menuItems={languageItem}
                                                      onChange={this.changeMenu}>
                                        </DropDownMenu>
                                    </div>
                                    <div
                                        className="btn-group btn-group-sm pull-right">
                                        <button type="button"
                                                style={{
                                                    display: display
                                                }}
                                                className="btn btn-link "
                                                onClick={this.execute}>
                                            <i className="fa fa-play"
                                               aria-hidden="true"></i>
                                        </button>
                                        <ChangeButton
                                            cssFlag={cell.viewSettings.fullScreen}
                                            trueCss="fa fa-compress"
                                            falseCss="fa fa-expand"
                                            onClick={this.fullScreenMode}/>
                                        <ChangeButton
                                            cssFlag={cell.viewSettings.view}
                                            trueCss="fa fa-eye"
                                            falseCss="fa fa-eye-slash"
                                            onClick={this.viewMode}/>
                                        <button type="button"
                                                style={{
                                                    display: deleteBtnDisplay
                                                }}
                                                className={deleteBtnCss}
                                                onClick={this.deleteCell}>
                                            <i className="fa fa-times"
                                               aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>

                                <div style={{
                                    clear: 'both',
                                    display: display
                                }}></div>


                                <div className="card-editor"
                                     ref={el => this.cardEditor = el}
                                     style={{display: display}}>
                                    <CardEditor
                                        id={cell.id + '_editor'}
                                        language={cell.language}
                                        code={cell.code}/>
                                </div>

                                <div className="card-content">
                                    <div ref={el => this.progressWrapper = el}
                                         id={cell.id + "_loading"}
                                         className="progress-wrapper"
                                         style={{display: 'block'}}>
                                        <img style={{
                                            width: "80px",
                                            height: "80px"
                                        }}
                                             src='/images/spinner.gif'/>
                                    </div>

                                    <CellResult cellId={cell.id}
                                                notebookId={this.props.notebookId}
                                                language={cell.language}
                                                result={cell.result}
                                                className={cellResultClass}
                                                status={cell.status}
                                                msg={cell.msg}
                                                viewSettings={cell.viewSettings}/>
                                </div>

                                <div className="card-footer">
                                    <CardFooter language={cell.language}
                                                result={cell.result}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    execute = () => {
        this.progressWrapper.style.display = 'block';
        let notebookId = this.props.notebookId;
        let cellId = this.props.cell.id;
        let editorId = cellId + '_editor';
        let editorContent = ace.edit(editorId).getValue();

        let cell = {
            'id': cellId,
            'code': editorContent,
            'language': this.props.cell.language
        }
        this.props.executeCell(notebookId, cellId, cell);
    }

    updateCell = () => {
        let notebookId = this.props.notebookId;
        let cellId = this.props.cell.id;
        let editorId = cellId + '_editor';
        let editorContent = ace.edit(editorId).getValue();
        let cell = {
            'id': cellId,
            'code': editorContent,
            'language': this.props.cell.language
        }
        this.props.updateCell(notebookId, cellId, cell);
    }

    changeMenu = language => {
        let notebookId = this.props.notebookId;
        let cellId = this.props.cell.id;
        let editorId = cellId + '_editor';
        let editorContent = ace.edit(editorId).getValue();
        let itemContent = {
            'id': cellId,
            'code': editorContent,
            'language': language
        }
        this.props.updateCell(notebookId, cellId, itemContent);
    }

    deleteCell = () => {
        if (this.props.canBeDelete) {
            this.setState({exist: false});
            this.props.deleteCell(this.props.notebookId, this.props.cell.id);
        }
    }

    computeHeight = () => {
        let screenHeight = window.innerHeight || document.documentElement.clientHeight;
        let cellPanelHeight = screenHeight - headHeight;
        return cellPanelHeight;
    }

    cardContentHeight = (fullScreenMode, viewMode) => {
        let cellPanelHeight = fullScreenMode ? this.computeHeight() : initPanelHeight;
        let currentEditorHeight = cardEditorHeight;


        if (fullScreenMode) {
            if (viewMode) {
                let placeHeight = pannelbodyPadding +
                    cardHeadHeight +
                    currentEditorHeight +
                    cardContentToolbox +
                    cardContentPadding +
                    cardContentBottomMargin +
                    footer;
                return cellPanelHeight - placeHeight;
            } else {
                let placeHeight = pannelbodyPadding +
                    cardContentToolbox +
                    cardContentPadding +
                    cardContentBottomMargin +
                    footer - 10;
                return cellPanelHeight - placeHeight;
            }
        } else {
            return initCardContentHeight;
        }

    }


    viewMode = cssFlag => {
        let notebookId = this.props.notebookId;
        let cellId = this.props.cell.id;
        let editorId = cellId + '_editor';
        let editorContent = ace.edit(editorId).getValue();
        let cell = {
            'id': cellId,
            'code': editorContent,
            'language': this.props.cell.language,
            'viewSettings': {
                ...this.props.cell.viewSettings,
                'view': cssFlag
            }
        }
        this.props.updateCell(notebookId, cellId, cell);
    }

    fullScreenMode = cssFlag => {
        let notebookId = this.props.notebookId;
        let cellId = this.props.cell.id;
        let editorId = cellId + '_editor';
        let editorContent = ace.edit(editorId).getValue();
        let cell = {
            'id': cellId,
            'code': editorContent,
            'language': this.props.cell.language,
            'viewSettings': {
                ...this.props.cell.viewSettings,
                'fullScreen': cssFlag
            }
        }
        this.props.updateCell(notebookId, cellId, cell);
        this.props.changeHeadMode({'fullScreen': cssFlag});
    }


}


// Map Redux state to component props
function mapStateToProps(state) {
    return {};
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return {
        changeHeadMode: mode => dispatch(changeHeadMode(mode)),
        deleteCell: (notebookId, cellId) => dispatch(deleteItem(notebookId, cellId)),
        updateCell: (notebookId, cellId, cell) => dispatch(updateItem(notebookId, cellId, cell)),
        executeCell: (notebookId, cellId, cell) => dispatch(executeCell(notebookId, cellId, cell))
    };
}

// Connected Component
export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(NotebookCell);