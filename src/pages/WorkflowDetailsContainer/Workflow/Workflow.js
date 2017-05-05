import React from 'react';
import { Card } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import HistoryIcon from 'material-ui/svg-icons/action/history';
import WorkflowList from './WorkflowList';
import WorkflowCreationDialog from './WorkflowCreationDialog';
import ChangeLog from '../../Notifications/ChangeLog'
import { ACMECorpGrey, ACMECorpDarkBlue } from '../../../colors.js'
const Workflow = (props) => (

  <Card style={{
    width: '74%',
    marginTop: '24px',
    position: 'relative'
  }}>

    <div style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      alignItems: 'center',
      top: '16px',
      right: '-26px'
    }}>
      <FloatingActionButton disabled={!props.loggedInUser.role.write} backgroundColor={ACMECorpDarkBlue} onTouchTap={() => props.openWorkflowDialog(false)} style={{
        position: 'relative'
      }}>
        <ContentAdd />
      </FloatingActionButton>
      <FloatingActionButton mini={true} onTouchTap={() => props.openHistory()} backgroundColor={ACMECorpGrey} style={{
        position: 'relative',
        marginTop: '8px',
        zIndex: 2
      }}>
        <HistoryIcon />
      </FloatingActionButton>
    </div>
    <WorkflowList {...props} />

    <ChangeLog {...props} />
    <WorkflowCreationDialog {...props} />
  </Card>
);

export default Workflow;
