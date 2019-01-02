import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { Menu, Icon, message } from 'antd';

import { deleteRoomAction } from 'models/room/actions';

const SubMenu = Menu.SubMenu;

const TabWidget = ({
  match,
  location: { pathname },
  room,
  history,
  actions,
}) => {
  const currentKey = pathname.split('/')[2] || 'room';
  return (
    <Menu selectedKeys={[currentKey]} mode="horizontal" theme="dark">
      <Menu.Item key="title">
        <Link to="/">
          <h2
            style={{
              display: 'inline',
              margin: '0 13px 0 13px',
              color: 'white',
            }}
          >
            JS-EXAM
          </h2>
        </Link>
      </Menu.Item>
      <Menu.Item key="room">
        <Link to="/">
          <Icon type="home" theme="filled" />
          Room
        </Link>
      </Menu.Item>
      <Menu.Item key="add">
        <Link to="/admin/add">
          <Icon type="file-add" theme="filled" />
          Add
        </Link>
      </Menu.Item>
      <Menu.Item key="edit">
        <Link to="/admin/edit">
          <Icon type="edit" theme="filled" />
          Edit
        </Link>
      </Menu.Item>
      {room.subjectId && (
        <Menu.Item style={{ float: 'right' }} key="subjectId">
          <Icon type="user" />
          {room.subjectId || 'UNSET'}
        </Menu.Item>
      )}
      {room.id && (
        <SubMenu
          style={{ float: 'right' }}
          key="dispatch"
          title={
            <Link to={`/admin/dispatch/${room.id}`}>
              <Icon type="home" />
              {room.description || 'UNSET'}
            </Link>
          }
        >
          <Menu.Item
            key="link"
            onClick={() => {
              const link = `${document.location.host}/exam/${
                match.params.roomId
              }`;
              navigator.clipboard.writeText(link).then(() => {
                message.success(`Successfully copied the link! -> ${link}`);
              });
            }}
          >
            <Icon type="share-alt" /> Copy Exam Link
          </Menu.Item>
          <Menu.Item
            key="delete"
            onClick={async () => {
              await actions.deleteRoomAction(room.id);
              history.push('/');
            }}
          >
            <Icon type="delete" style={{ color: 'red' }} /> Delete Room
          </Menu.Item>
        </SubMenu>
      )}
    </Menu>
  );
};

export default withRouter(
  connect(
    state => {
      return {
        room: state.room,
      };
    },
    dispatch => {
      return {
        actions: {
          deleteRoomAction: id => dispatch(deleteRoomAction(id)),
        },
      };
    },
  )(TabWidget),
);
