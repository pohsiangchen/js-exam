import React, { Component } from 'react';
import { connect } from 'react-redux';
import { transform } from 'buble';
import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/textmate';
import 'brace/theme/monokai';
import AceEditor from 'react-ace';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';


import {
  changeCode,
  changeQuestion,
  resetQuestion
} from '../../../actions/questionDispatch';
import {
  resetConsole
} from '../../../actions/console';
import './MainPage.css';
import debouncedRunCode from '../../../utils/runCode';
import Border from './Border';
import Console from './Console';
import createWrappedConsole from '../../../utils/consoleFactory';
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../../../graphql/mutations.js';

class MainPage extends Component {
  state = {
    recordId: ''
  }
  constructor(props) {
    super(props);

    this.testsRef = React.createRef();
    this.wrappedConsole = createWrappedConsole(console, this.props.actions._dispatch);
    this.state = {
      SyntaxError: '',
      index: 0,
      question: { name: '', content: '', test: '' }
    };

    // this.handleSelected = this.handleSelected.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);

    this.actions = this.props.actions;
    this.resetQuestion = this.actions.resetQuestion;
    this.changeQuestion = this.actions.changeQuestion;
    this.changeCode = this.actions.changeCode;
    this.resetConsole = this.actions.resetConsole;
    this.changeSyntaxError = this.actions.changeSyntaxError;

  }

  componentDidMount() {
    // if (!this.props.isLogin) {
    //   this.props.history.push('/js-exam/login');
    //   return;
    // }
    const { rawCode } = this.props;
    this.handleCodeChange(rawCode);
  }

  componentWillUpdate(nextProps, nextState) {
    const { compiledCode } = nextProps;
    if (this.testsRef.current) {
      this.testsRef.current.innerHTML = '';
      debouncedRunCode(compiledCode, this.wrappedConsole);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps", nextProps)
    if (this.props.index !== nextProps.index || nextProps.compiledCode === '') {
      this.handleCodeChange(nextProps.rawCode);
      this.createRecord();
    }
  }

  // handleSelected(index) {
  //   this.changeQuestion(index);
  // }

  handleCodeChange(newCode) {
    const fullCode = `${newCode} ${this.props.question.test}`;
    this.resetConsole();
    try {
      /*
        not support
        [...'abc'],
        async & await
      */
      const { code } = transform(fullCode, {
        transforms: {
          dangerousForOf: true,
          spreadRest: true,
          objectRestSpread: true
        },
        objectAssign: 'Object.assign',
      });
      this.changeCode({ compiledCode: code, rawCode: newCode });
      this.updateRecord(newCode);
      this.setState({ 'SyntaxError': '' }); //clear syntax error
    } catch (e) {
      this.changeCode({ rawCode: newCode });
      if (e.loc) {
        const { line, column } = e.loc;
        this.setState({ SyntaxError: `Syntax error: line ${line}, column ${column}` });
      }
    }
  }
  // when receive new question, create a record
  async createRecord() {
    console.log("createRecord");
    // divided by 1000 because we use Int to save the timeBegin
    const timeBegin = parseInt(new Date().getTime() / 1000);
    const params = {
      input: {
        timeBegin
      }
    }
    const { data } = await API.graphql(graphqlOperation(mutations.createRecord, params))
    this.setState({ recordId: data.createRecord.id })
    console.log(data)
  }
  async updateRecord(newCode) {
    if (this.state.recordId) {
      console.log("updateRecord", this.state.recordId, newCode);
      const params = {
        input: {
          id: this.state.recordId,
          history: newCode
        }
      }
      const result = await API.graphql(graphqlOperation(mutations.updateRecord, params))
      console.log(result)
    }

  }
  render() {
    const { rawCode, index } = this.props;
    console.log("#render", this.state);
    return (
      <div className="App">
        <Border className="input-panel" allowWidth>
          <Border
            className="code-panel"
            allowHeight
            width={window.innerWidth / 2}
            height={window.innerHeight / 2}
          >
            <AceEditor
              showPrintMargin={false}
              mode="javascript"
              theme="monokai"
              onChange={this.handleCodeChange}
              value={rawCode}
              tabSize={2}
              debounceChangePeriod={800}
            />
          </Border>
          <div
            className="test-panel"
          >
            <AceEditor
              showPrintMargin={false}
              mode="javascript"
              theme="textmate"
              value={this.props.question.test}
              readOnly={true}
              tabSize={2}
              debounceChangePeriod={800}
            />
          </div>
        </Border>
        <div className="result-panel">
          <div className="top-panel">
            <div className="additional-info">
              {/* <QuestionSelector
                handleSelected={this.handleSelected}
                activeIndex={index}
              /> */}
              <Button type="danger" onClick={(this.resetQuestion)}>Reset</Button>
              {!this.state.SyntaxError
                ? null
                : <div className="syntax-error">
                  {this.state.SyntaxError}
                </div>}
            </div>
            <Border
              className="control-panel"
              allowHeight
              width={window.innerWidth / 2}
              height={window.innerHeight / 2}
            >
              <div id="tests" ref={this.testsRef} />
            </Border>
          </div>
          <Console className="bottom-panel" />
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  state => {
    const { code: codeObj } = state;
    console.log("#state to props: state", state);
    // console.log("#state to props: state",  codeObj);
    const { index } = codeObj;
    const compiledCode = codeObj.compiledCode;
    const rawCode = codeObj.rawCode || codeObj.question.content;
    return {
      rawCode,
      compiledCode,
      index,
      isLogin: state.login.isLogin,
      question: codeObj.question
    };
  },
  dispatch => {
    return {
      actions: {
        changeCode: (args) => dispatch(changeCode(args)),
        changeQuestion: data => dispatch(changeQuestion(data)),
        resetQuestion: () => dispatch(resetQuestion()),
        _dispatch: dispatch,
        resetConsole: () => dispatch(resetConsole())
      }
    };
  }
)(MainPage));
