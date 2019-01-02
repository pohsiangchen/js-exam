import { getRoom, deleteRoom, updateRoom } from 'utils/room';
import { setCurrentRecord, resetCurrentRecord } from 'models/record/actions';

import graphqlActionHelper, { ACTION_STATE } from 'utils/graphqlActionHelper';

function getRoomInfo(id) {
  return async dispatch => {
    dispatch(
      graphqlActionHelper({
        method: 'FETCH',
        dataName: 'ROOM',
        actionState: ACTION_STATE.STARTED,
      }),
    );
    try {
      const result = await getRoom(id);
      dispatch(
        graphqlActionHelper({
          method: 'FETCH',
          dataName: 'ROOM',
          actionState: ACTION_STATE.SUCCESS,
          result,
        }),
      );
      if (result.currentRecord) {
        dispatch(setCurrentRecord(result.currentRecord));
      } else {
        dispatch(resetCurrentRecord());
      }
      console.log('#get room', result);
    } catch (error) {
      dispatch(
        graphqlActionHelper({
          method: 'FETCH',
          dataName: 'ROOM',
          actionState: ACTION_STATE.FAILURE,
          result: error,
        }),
      );
    }
  };
}

function updateRoomInfo(id, password) {
  return async dispatch => {
    dispatch(
      graphqlActionHelper({
        method: 'UPDATE',
        dataName: 'ROOM',
        actionState: ACTION_STATE.STARTED,
      }),
    );
    try {
      const result = await updateRoom(id, password);
      dispatch(
        graphqlActionHelper({
          method: 'UPDATE',
          dataName: 'ROOM',
          actionState: ACTION_STATE.SUCCESS,
          result,
        }),
      );
    } catch (error) {
      dispatch(
        graphqlActionHelper({
          method: 'UPDATE',
          dataName: 'ROOM',
          actionState: ACTION_STATE.FAILURE,
          result: error,
        }),
      );
    }
  };
}

function deleteRoomAction(id) {
  return async dispatch => {
    dispatch(
      graphqlActionHelper({
        method: 'DELETE',
        dataName: 'ROOM',
        actionState: ACTION_STATE.STARTED,
      }),
    );
    try {
      await deleteRoom(id);
      dispatch(
        graphqlActionHelper({
          method: 'DELETE',
          dataName: 'ROOM',
          actionState: ACTION_STATE.SUCCESS,
        }),
      );

      dispatch(resetCurrentRecord());
    } catch (error) {
      dispatch(
        graphqlActionHelper({
          method: 'DELETE',
          dataName: 'ROOM',
          actionState: ACTION_STATE.FAILURE,
          result: error,
        }),
      );
      console.log(error);
    }
  };
}

export { getRoomInfo, deleteRoomAction, updateRoomInfo };
