import React, { Component } from 'react';
import { connect } from 'react-redux';
import { transform } from 'buble';
// import 'brace';
// import 'brace/mode/javascript';
// import 'brace/theme/textmate';
// import 'brace/theme/monokai';
import AceEditor from 'react-ace';
import { withRouter } from 'react-router-dom';
// import { Button } from 'antd';

import QuestionList from './QuestionList';
import QuestionEditor from './QuestionEditor';

import './page.css';

// import questions from '../../questions';

import {
  updateQuestionList,
  changeCode
} from '../../actions/questionDispatch';

import Amplify, {
  API,
  graphqlOperation
} from 'aws-amplify';

import awsExportConfig from '../../aws-exports.js';

import * as mutations from '../../graphql/mutations.js';
import * as subscriptions from '../../graphql/subscriptions.js';

// console.log(">>> createQuestionSnapshot", mutations.createQuestionSnapshot)

Amplify.configure(awsExportConfig);

class MainPage extends Component {
  state = {
    recordId: ''
  }
  constructor(props) {
    super(props);

    // this.listQuestions =f listQuestions.bind(this);
    this.updateQuestionList = this.props.actions.updateQuestionList;

    // this.testsRef = React.createRef();
    // this.wrappedConsole = createWrappedConsole(console, this.props.actions._dispatch);
    // this.state = { SyntaxError : '' } ;
    // this.handleSelected = this.handleSelected.bind(this);
    // // this.handleCodeChange = _.debounce(this.handleCodeChange.bind(this), 800);
    // this.handleCodeChange = this.handleCodeChange.bind(this);

    // this.actions = this.props.actions ;
    // this.resetQuestion = this.actions.resetQuestion ;
    // this.changeQuestion = this.actions.changeQuestion ;
    // this.changeCode = this.actions.changeCode;
    // this.resetConsole = this.actions.resetConsole;
    // this.changeSyntaxError = this.actions.changeSyntaxError;


    // let counter = 0;
    // function createData(type, questionSet, name, content, test, tags) {
    //   return { id: counter++, type, questionSet, name, content, test, tags };
    // }

    // this.listRows = [
    //   createData('reactjs', null, 'question1', questions[0].content, questions[0].test, ['question1 tags']),
    //   createData('nodejs', null, 'question2', questions[1].content, questions[1].test, ['question2 tags']),
    //   createData('javascript', null, 'question3', questions[2].content, questions[2].test, ['question3 tags']),
    // ];

    // console.log("#this.listRows", this.listRows)

  }

  async listQuestions() {
    console.log('###listing room');
    const listQuestionsOp = `query ListQuestions {
      listQuestions {
        items{
          id
          name
          content
          test
        }
      }
    }`;
    const result = await API.graphql(graphqlOperation(listQuestionsOp));
    // console.log("#listQuestions", JSON.stringify(result));
    this.updateQuestionList(result.data.listQuestions.items);
  };

  // async updateRoomQuestionSource(question) {
  //   console.log('update room');
  //   const params = {
  //     input: {
  //       questionSourceStr: JSON.stringify(question)
  //       // questionSource: {
  //       //   name: question.name,
  //       //   content: question.content,
  //       //   test: question.test        
  //       // }
  //     }
  //   };
  //   // const updateRoomOp = `mutation UpdateRoom($input: UpdateRoomInput!) {
  //   //   updateRoom(input: $input) {
  //   //     id
  //   //     subjectId
  //   //     description
  //   //     progress
  //   //     questionSource {
  //   //       name
  //   //       content
  //   //       test
  //   //     }
  //   //   }
  //   // }`;
  //   const result = await API.graphql(graphqlOperation(mutations.updateRoom, params));
  //   alert(JSON.stringify(result));
  // };

  // async updateQuestionSnapshot(question) {
  //   console.log('updateQuestionSnapshot');
  //   const params = {
  //     input: {
  //       name: question.name,
  //       content: question.content,
  //       test: question.test,
  //       questionSnapshotRoomId: "demoRoom1"
  //     }
  //   };
  //   // const updateRoomOp = `mutation UpdateRoom($input: UpdateRoomInput!) {
  //   //   updateRoom(input: $input) {
  //   //     id
  //   //     subjectId
  //   //     description
  //   //     progress
  //   //     questionSource {
  //   //       name
  //   //       content
  //   //       test
  //   //     }
  //   //   }
  //   // }`;
  //   const result = await API.graphql(graphqlOperation(mutations.updateQuestionSnapshot, params));
  //   alert(JSON.stringify(result));
  // };

  async createQuestionSnapshot(question) {
    console.log('updateQuestionSnapshot');
    const params = {
      input: {
        name: question.name,
        content: question.content,
        test: question.test,
        questionSnapshotRoomId: "demoRoom1"
      }
    };
    const result = await API.graphql(graphqlOperation(mutations.createQuestionSnapshot, params));
    alert(JSON.stringify(result));
  };

  btnDispatchQuestion(question) {
    // this.updateRoomQuestionSource(question);
    this.createQuestionSnapshot(question);
  }
  // receive code data from interviewee page
  subscribeOnCreateRecord() {
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onCreateRecord)
    ).subscribe({
      next: ({ value }) => {
        console.log("onCreateRecord", value)
        this.setState({ recordId: value.data.onCreateRecord.id })
      }
    })
  }

  subscribeOnUpdateRecord() {
    const subscription = API.graphql(
      graphqlOperation(subscriptions.onUpdateRecord)
    ).subscribe({
      next: ({ value }) => {
        console.log("onUpdateRecord", value)
        this.props.actions.changeCode({ rawCode: value.data.onUpdateRecord.history[0] });

      }
    })
  }

  componentDidMount() {
    this.listQuestions();
    this.subscribeOnCreateRecord();
    this.subscribeOnUpdateRecord();
  }

  componentWillUpdate(nextProps, nextState) {

  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    console.log("### render ", this.props)
    return (
      // <div>admin dispatch</div>
      <span className="questionEditor-container">
        <div className="questionEditor-panel-left">
          <QuestionList listRows={this.props.listRows} btnDispatchQuestion={this.btnDispatchQuestion.bind(this)}></QuestionList>
        </div>
        <div className="questionEditor-panel-right">
          <QuestionEditor></QuestionEditor>
        </div>
      </span>
    );
  }
}

export default withRouter(connect(
  state => {
    console.log("### listRows", state);
    let { questionDispatch } = state;
    console.log("### questionDispatch", questionDispatch);

    return {
      listRows: questionDispatch.questions || []
    };
  },
  dispatch => {
    return {
      actions: {
        updateQuestionList: (questions) => dispatch(updateQuestionList(questions)),
        changeCode: (args) => dispatch(changeCode(args)),
      }
    };
  }
)(MainPage));
