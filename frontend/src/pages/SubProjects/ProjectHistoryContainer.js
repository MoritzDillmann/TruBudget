import { fromJS } from "immutable";
import sortBy from "lodash/sortBy";
import React, { Component } from "react";
import { connect } from "react-redux";
// import { formatUpdateString } from "../../helper";
import { formatString, toJS } from "../../helper";
import strings from "../../localizeStrings";
import { formatPermission } from "../Common/History/helper";
import ResourceHistory from "../Common/History/ResourceHistory";
import { hideHistory } from "../Notifications/actions";
import { fetchProjectHistory, setProjectHistoryOffset } from "./actions";

const calculateHistory = items => {
  return sortBy(
    items.reduce((acc, item) => {
      return acc.concat(item);
    }, []),
    "createdAt"
  ).reverse();
};

const mapIntent = ({ createdBy, intent, data, snapshot }) => {
  switch (intent) {
    case "project_created":
      return formatString(strings.history.project_create, createdBy, snapshot.displayName);
    case "project_updated":
      return strings.formatString(strings.history.project_update, createdBy, snapshot.displayName);
    case "project_assigned":
      return formatString(strings.history.project_assign, createdBy, snapshot.displayName, data.identity);
    case "project_closed":
      return formatString(strings.history.project_close, createdBy, snapshot.displayName);
    case "project_permission_granted": // TODO: missing history Event
      return formatString(strings.history.project_grantPermission, createdBy, formatPermission(data), data.identity);
    case "project_permission_revoked": // TODO: missing history Event
      return formatString(strings.history.project_revokePermission, createdBy, formatPermission(data), data.identity);
    case "subproject_created":
      return formatString(strings.history.subproject_create, createdBy, snapshot.displayName);
    case "subproject_updated":
      return formatString(strings.history.subproject_update, createdBy, snapshot.displayName);
    case "subproject_assigned":
      return formatString(strings.history.subproject_assign, createdBy, snapshot.displayName, data.identity);
    case "subproject_closed":
      return formatString(strings.history.subproject_close, createdBy, snapshot.displayName);
    case "subproject_intent.grantPermissioned":
      return formatString(
        strings.history.project_grantPermission_details,
        createdBy,
        formatPermission(data),
        data.identity,
        snapshot.displayName
      );
    case "subproject_intent.revokePermissioned":
      return formatString(
        strings.history.subproject_revokePermission_details,
        createdBy,
        formatPermission(data),
        data.identity,
        snapshot.displayName
      );
    default:
      console.log("WARN: Intent not defined:", intent);
      return intent;
  }
};

class ProjectHistoryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceHistory: fromJS([]),
      items: fromJS([])
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // only calculate if history is shown and workflow state changed
    if (nextProps.show && nextProps.items !== prevState.items) {
      const resourceHistory = calculateHistory(nextProps.items);
      return {
        items: nextProps.items,
        resourceHistory
      };
    } else {
      return {
        ...prevState
      };
    }
  }

  fetchNextHistoryItems = () => {
    const newOffset = this.props.offset + this.props.limit;
    this.props.fetchProjectHistory(this.props.projectId, newOffset, this.props.limit);
  };

  render() {
    return (
      <ResourceHistory
        fetchNextHistoryItems={this.fetchNextHistoryItems}
        isLoading={this.state.isLoading}
        resourceHistory={this.state.resourceHistory}
        mapIntent={mapIntent}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.getIn(["detailview", "historyItems"]),
    historyItemsCount: state.getIn(["detailview", "historyItemsCount"]),
    show: state.getIn(["notifications", "showHistory"]),
    isLoading: state.getIn(["detailview", "isHistoryLoading"])
  };
};
const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(hideHistory()),
    setProjectHistoryOffset: offset => dispatch(setProjectHistoryOffset(offset)),
    fetchProjectHistory: (projectId, offset, limit) => dispatch(fetchProjectHistory(projectId, offset, limit, false))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(toJS(ProjectHistoryContainer));
