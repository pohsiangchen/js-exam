import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Icon, Dropdown, Menu, message } from 'antd';

import PageControlBar from 'components/PageControlBar';
import CategorySelector from 'components/Selectors/CategorySelector';
import QuestionSelector from 'components/Selectors/QuestionSelector';
import { RECORD_STATUS } from 'utils/record';

import styles from './ControlWidget.module.scss';

const InputGroup = Input.Group;

function getRecordStatus(question, record) {
  if (question.name === record.ques.name) {
    return record.status;
  }
  return null; // not dispatched yet
}

const ControlWidget = ({
  record,
  question,
  intervieweeName,
  roomId,
  roomDescription,
  categoryIndex,
  questionIndex,
  onDispatchQuestion,
  onEndExam,
  onChangeCategory,
  onChangeQuestion,
  questionList,
  isHost,
  showDelConfirmModal,
}) => {
  const recordStatus = getRecordStatus(question, record);
  const menu = (
    <Menu>
      <Menu.Item key="link"
        onClick={() => {
          const link = `${document.location.host}/exam/${roomId}`;
          navigator.clipboard.writeText(link).then(() => {
            message.success(`Successfully copied the link!`);
          });
        }}
      >
        <Icon type="share-alt" /> Copy Exam Link
      </Menu.Item>
      {isHost &&
        <Menu.Item
          key="delete"
          onClick={showDelConfirmModal}
        >
          <Icon type="delete" style={{ color: 'red' }} /> Delete Room
        </Menu.Item>
      }
    </Menu>
  );

  return (
    <PageControlBar>
      <div>
        <div className={styles.roomInfoBar}>
          <Dropdown overlay={menu} placement="bottomLeft">
            <span className={styles.roomInfoBar_room}>
              Room:
              <span className={styles.roomInfoBar_label}>{roomDescription}</span>
              <Icon type="down" />
            </span>
          </Dropdown>
          <span>
            Interviewee:
            <span className={styles.roomInfoBar_label}>{intervieweeName}</span>
          </span>
        </div>
        {isHost &&
          <InputGroup compact style={{ width: 'auto', display: 'inline-block' }}>
            <CategorySelector
              disabled={recordStatus === RECORD_STATUS.inprogress}
              onChange={onChangeCategory}
              categoryIndex={categoryIndex}
            />
            <QuestionSelector
              disabled={recordStatus === RECORD_STATUS.inprogress}
              onChange={onChangeQuestion}
              questionIndex={questionIndex}
              list={questionList}
            />
            {recordStatus === RECORD_STATUS.inprogress || recordStatus === RECORD_STATUS.closed ?
            <Button type="primary" onClick={onEndExam} disabled={recordStatus === RECORD_STATUS.closed}>
              End Exam
              <Icon type="right" />
            </Button>:
            <Button type="primary" onClick={onDispatchQuestion}>
              Dispatch
              <Icon type="right" />
            </Button>
            }
          </InputGroup>
        }
      </div>
    </PageControlBar>
  );
};

ControlWidget.propTypes = {
  isHost: PropTypes.bool.isRequired,
  question: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  intervieweeName: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
  roomDescription: PropTypes.string.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  questionIndex: PropTypes.number.isRequired,
  onDispatchQuestion: PropTypes.func.isRequired,
  onEndExam: PropTypes.func.isRequired,
  onChangeCategory: PropTypes.func.isRequired,
  onChangeQuestion: PropTypes.func.isRequired,
  questionList: PropTypes.arrayOf(PropTypes.object).isRequired,
  showDelConfirmModal: PropTypes.func.isRequired,
};

export default ControlWidget;
