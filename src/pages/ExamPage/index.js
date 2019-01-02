import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { transform } from '@babel/standalone';
import { message, Spin } from 'antd';

import createWrappedConsole from 'utils/consoleFactory';
import { subscribeOnCreateRecord } from 'utils/record';
import { getRoomInfo, updateRoomInfo } from 'models/room/actions';
import { setCurrentRecord, updateRecordData } from 'models/record/actions';

import ControlWidget from './ControlWidget';
import ReactPage from './ReactPage';
import JavaScriptPage from './JavaScriptPage';

const GetPageComponent = args => {
  switch (args.categoryIndex) {
    case 1: {
      return <ReactPage {...args} />;
    }
    default: {
      return <JavaScriptPage {...args} />;
    }
  }
};

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryIndex: 0,
      code: '',
      compiledCode: '',
      questionContent: '',
      test: '',
      tape: [],
      recordId: '',
      console: [],
      intervieweeName: '',
      visibleIntervieweeModal: true,
      roomId: this.props.match.params.roomId,
      roomPassword: '',
      isLoading: false,
      enableEnter: true,
    };
    this.wrappedConsole = createWrappedConsole(console, this.addConsole);
  }

  componentDidMount() {
    this.getRoom(this.state.roomId);
    this.subscribeCreateRecord();
  }

  getRoom = async id => {
    this.setState({
      isLoading: true,
    });
    await this.props.actions.getRoomInfo(id);
    console.log(id);
    this.passwordSetting(this.props.room.password);
  };

  passwordSetting = async roomPassword => {
    const { roomId } = this.state;
    if (!roomPassword) {
      const password = Math.random()
        .toString(15)
        .substr(2);
      this.setState({
        roomPassword: password,
        intervieweeName: this.props.room.subjectId,
      });
      localStorage.examRoomPassword = password;
      await this.props.actions.updateRoomInfo(roomId, password);
      this.setState({
        isLoading: false,
      });
    } else if (localStorage.examRoomPassword === roomPassword) {
      this.setState({
        isLoading: false,
        intervieweeName: this.props.room.subjectId,
      });
    } else {
      message.error("You Can't Not Enter the Page");
      this.setState({
        enableEnter: false,
        isLoading: false,
      });
    }
  };

  updateRecordAction = async newCode => {
    const { recordId } = this.state;
    await this.props.actions.updateRecordData(recordId, newCode);
  };

  handleCodeChange = newCode => {
    const { test } = this.state;
    const fullCode = `${newCode} ${test}`;

    try {
      const { code: compiledCode } = transform(fullCode, {
        presets: [
          'es2015',
          ['stage-2', { decoratorsBeforeExport: true }],
          'react',
        ],
        plugins: ['proposal-object-rest-spread'],
      });
      this.setState({ compiledCode, code: newCode });
      this.updateRecordAction(newCode);
    } catch (e) {
      this.setState({ code: newCode });
      this.resetConsole();
      this.wrappedConsole.log(e);
      this.updateRecordAction(newCode);
    }
  };

  onReset = () => {
    const { questionContent } = this.state;
    this.setState({ code: questionContent });
    this.handleCodeChange(questionContent);
  };

  addTape = newTape => {
    const { tape } = this.state;
    this.setState({ tape: [...tape, newTape] });
  };

  resetTape = () => {
    this.setState({ tape: [] });
  };

  addConsole = (...args) => {
    const { console: _console } = this.state;
    this.setState({ console: [..._console, ...args] });
  };

  resetConsole = () => {
    this.setState({ console: [] });
  };

  subscribeCreateRecord = () => {
    subscribeOnCreateRecord(data => {
      const { room, ques, id } = data;
      if (room.id === this.props.room.id) {
        this.props.actions.setCurrentRecord(data);
        // to receive new question dispatched
        this.setState({
          recordId: id,
          questionName: ques.name,
          code: ques.content,
          questionContent: ques.content,
          test: ques.test,
        });
      }
    });
  };

  render() {
    const {
      handleCodeChange,
      wrappedConsole,
      onReset,
      addTape,
      resetTape,
      resetConsole,
      setIntervieweeModal,
    } = this;
    const { intervieweeName, isLoading, enableEnter } = this.state;
    return (
      <div>
        <Spin spinning={isLoading}>
          {enableEnter ? (
            <>
              <ControlWidget
                intervieweeName={intervieweeName}
                onReset={() => onReset('javascript')}
                setIntervieweeModal={setIntervieweeModal}
              />
              <GetPageComponent
                handleCodeChange={handleCodeChange}
                wrappedConsole={wrappedConsole}
                onReset={onReset}
                addTape={addTape}
                resetTape={resetTape}
                resetConsole={resetConsole}
                setIntervieweeModal={setIntervieweeModal}
                {...this.state}
                {...this.props}
              />
            </>
          ) : (
            <div>
              <h1>WRONG EXAM ROOM</h1>
            </div>
          )}
        </Spin>
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => {
      return {
        room: state.room,
        record: state.record,
      };
    },
    dispatch => {
      return {
        actions: {
          getRoomInfo: id => dispatch(getRoomInfo(id)),
          updateRoomInfo: (id, password) =>
            dispatch(updateRoomInfo(id, password)),
          setCurrentRecord: recordData =>
            dispatch(setCurrentRecord(recordData)),
          updateRecordData: (id, syncCode) =>
            dispatch(updateRecordData(id, syncCode)),
        },
      };
    },
  )(Page),
);
