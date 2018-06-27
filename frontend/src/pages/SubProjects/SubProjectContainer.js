import React, { Component } from "react";
import { connect } from "react-redux";

import {
  fetchAllProjectDetails,
  showSubprojectDialog,
  storeSubProjectCurrency,
  createSubProject,
  storeSubProjectName,
  storeSubProjectAmount,
  storeSubProjectComment,
  showProjectAssignees,
  fetchProjectHistory,
  showEditDialog,
  editSubproject,
  closeProject,
  showSubProjectPermissions,
  hideSubprojectDialog
} from "./actions";

import SubProjects from "./SubProjects";
import { showSnackBar, storeSnackBarMessage, showHistory, hideHistory } from "../Notifications/actions";
import { setSelectedView } from "../Navbar/actions";
import ProjectDetails from "./ProjectDetails";
import globalStyles from "../../styles";
import { toJS } from "../../helper";
import strings from "../../localizeStrings";
import { fetchUser } from "../Login/actions";
import ProjectHistoryContainer from "./ProjectHistoryContainer";
import { canCreateSubProject, canAssignProject, canCloseProject } from "../../permissions";
import SubprojectPermissionsContainer from "./SubprojectPermissionsContainer";

class SubProjectContainer extends Component {
  constructor(props) {
    super(props);
    this.projectId = this.props.location.pathname.split("/")[2];
  }

  componentWillMount() {
    this.props.setSelectedView(this.projectId, "project");
    this.props.fetchAllProjectDetails(this.projectId, true);
    this.props.fetchUser();
  }

  closeProject = () => {
    const openSubprojects = this.props.subProjects.find(subproject => subproject.data.status === "open");
    if (!openSubprojects) {
      this.props.closeProject(this.projectId);
    }
  };

  render() {
    const canCreateSubproject = canCreateSubProject(this.props.allowedIntents);
    const canAssign = canAssignProject(this.props.allowedIntents);
    const canClose = canCloseProject(this.props.allowedIntents);
    return (
      <div>
        <div style={globalStyles.innerContainer}>
          <ProjectDetails
            {...this.props}
            canAssignProject={canAssign}
            closeProject={this.closeProject}
            canClose={canClose}
          />
          <SubProjects {...this.props} canCreateSubProject={canCreateSubproject} />
          <ProjectHistoryContainer />
          <SubprojectPermissionsContainer
            projectId={this.projectId}
            subProjects={this.props.subProjects}
            title={strings.subproject.subproject_permissions_title}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAllProjectDetails: (projectId, showLoading) => dispatch(fetchAllProjectDetails(projectId, showLoading)),
    showSubprojectDialog: () => dispatch(showSubprojectDialog()),
    hideSubprojectDialog: () => dispatch(hideSubprojectDialog()),
    storeSubProjectName: name => dispatch(storeSubProjectName(name)),
    createSubProject: (subprojectName, amount, description, currency, parentName) =>
      dispatch(createSubProject(parentName, subprojectName, amount, description, currency)),
    editSubproject: (pId, sId, changes) => dispatch(editSubproject(pId, sId, changes)),
    storeSubProjectAmount: amount => dispatch(storeSubProjectAmount(amount)),
    storeSubProjectComment: comment => dispatch(storeSubProjectComment(comment)),
    storeSubProjectCurrency: currency => dispatch(storeSubProjectCurrency(currency)),
    showSnackBar: () => dispatch(showSnackBar(true)),
    storeSnackBarMessage: message => dispatch(storeSnackBarMessage(message)),
    openHistory: projectId => {
      dispatch(fetchProjectHistory(projectId, true));
      dispatch(showHistory());
    },
    hideHistory: () => dispatch(hideHistory()),
    setSelectedView: (id, section) => dispatch(setSelectedView(id, section)),
    showProjectAssignees: () => dispatch(showProjectAssignees()),
    showEditDialog: (id, displayName, description, amount, currency) =>
      dispatch(showEditDialog(id, displayName, description, amount, currency)),
    fetchUser: () => dispatch(fetchUser(true)),
    closeProject: pId => dispatch(closeProject(pId, true)),
    showSubProjectPermissions: id => dispatch(showSubProjectPermissions(id))
  };
};

const mapStateToProps = state => {
  return {
    users: state.getIn(["login", "user"]),
    projectId: state.getIn(["detailview", "id"]),
    projectName: state.getIn(["detailview", "projectName"]),
    projectAmount: state.getIn(["detailview", "projectAmount"]),
    projectComment: state.getIn(["detailview", "projectComment"]),
    projectCurrency: state.getIn(["detailview", "projectCurrency"]),
    projectStatus: state.getIn(["detailview", "projectStatus"]),
    projectAssignee: state.getIn(["detailview", "projectAssignee"]),
    projectTS: state.getIn(["detailview", "projectTS"]),
    subProjects: state.getIn(["detailview", "subProjects"]),
    creationDialogShown: state.getIn(["detailview", "creationDialogShown"]),
    editDialogShown: state.getIn(["detailview", "editDialogShown"]),
    showProjectAssignees: state.getIn(["detailview", "showProjectAssignees"]),
    subprojectToAdd: state.getIn(["detailview", "subprojectToAdd"]),
    showHistory: state.getIn(["notifications", "showHistory"]),
    loggedInUser: state.getIn(["login", "loggedInUser"]),
    roles: state.getIn(["login", "roles"]),
    user: state.getIn(["login", "user"]),
    allowedIntents: state.getIn(["detailview", "allowedIntents"]),
    dialogTitle: state.getIn(["detailview", "dialogTitle"]),
    thumbnail: state.getIn(["detailview", "thumbnail"])
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(toJS(SubProjectContainer));
