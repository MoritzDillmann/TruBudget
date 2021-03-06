import { fromJS } from "immutable";

import {
  TOGGLE_SIDEBAR,
  FETCH_STREAM_NAMES_SUCCESS,
  SET_SELECTED_VIEW,
  FETCH_ACTIVE_PEERS_SUCCESS,
  FETCH_VERSIONS_SUCCESS
} from "./actions";
import { LOGOUT } from "../Login/actions";
import { FETCH_ALL_PROJECT_DETAILS_SUCCESS } from "../SubProjects/actions";
import { FETCH_ALL_SUBPROJECT_DETAILS_SUCCESS } from "../Workflows/actions";

const defaultState = fromJS({
  showSidebar: false,
  numberOfActivePeers: 0,
  unreadNotifications: 0,
  streamNames: {},
  selectedId: "",
  selectedSection: "",
  currentProject: " ",
  currentSubProject: " ",
  versions: null
});

export default function navbarReducer(state = defaultState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return state.set("showSidebar", !state.get("showSidebar"));
    case FETCH_ACTIVE_PEERS_SUCCESS:
      return state.set("numberOfActivePeers", action.activePeers);
    case FETCH_STREAM_NAMES_SUCCESS:
      return state.set("streamNames", fromJS(action.streamNames));
    case SET_SELECTED_VIEW:
      return state.merge({
        selectedId: action.id,
        selectedSection: action.section
      });
    case FETCH_ALL_PROJECT_DETAILS_SUCCESS:
      return state.set("currentProject", action.project.data.displayName);
    case FETCH_ALL_SUBPROJECT_DETAILS_SUCCESS:
      return state.merge({
        currentSubProject: action.subproject.data.displayName,
        currentProject: action.parentProject.displayName
      });
    case FETCH_VERSIONS_SUCCESS:
      return state.set("versions", action.versions);
    case LOGOUT:
      return defaultState;
    default:
      return state;
  }
}
