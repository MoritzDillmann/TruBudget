const can = (intentName, intents) => intents.indexOf(intentName) > -1;

export const canCreateProject = i => can("global.createProject", i);
export const canViewProjectDetails = i => can("project.viewDetails", i);
export const canViewSubProjectDetails = i => can("subproject.viewDetails", i);
export const canViewSubProjectPermissions = i => can("subproject.intent.listPermissions", i);
export const canAssignSubProject = i => can("subproject.assign", i);
export const canCreateWorkflowItems = i => can("subproject.createWorkflowitem", i);
export const canViewWorkflowItemPermissions = i => can("workflowitem.intent.listPermissions", i);
export const canUpdateWorkflowItem = i => can("workflowitem.update", i);
export const canCloseWorkflowItem = i => can("workflowitem.close", i);
export const canAssignWorkflowItem = i => can("workflowitem.assign", i);
export const canViewUserManagement = i => can("global.createUser", i);
export const canEditProject = i => can("project.update", i);

export const projectIntentOrder = [
  {
    name: "view",
    intents: ["project.viewSummary", "project.viewDetails"]
  },
  {
    name: "write",
    intents: ["project.createSubproject", "project.assign"]
  },
  {
    name: "admin",
    intents: ["project.intent.listPermissions", "project.intent.grantPermission", "project.intent.revokePermission"]
  }
];

export const subProjectIntentOrder = [
  {
    name: "view",
    intents: ["subproject.viewSummary", "subproject.viewDetails"]
  },
  {
    name: "write",
    intents: ["subproject.createWorkflowitem", "subproject.update", "subproject.assign", "subproject.close"]
  },
  {
    name: "admin",
    intents: [
      "subproject.intent.listPermissions",
      "subproject.intent.grantPermission",
      "subproject.intent.revokePermission"
    ]
  }
];
export const workflowItemIntentOrder = [
  {
    name: "view",
    intents: ["workflowitem.view"]
  },
  {
    name: "write",
    intents: ["workflowitem.assign", "workflowitem.update", "workflowitem.close"]
  },
  {
    name: "admin",
    intents: [
      "workflowitem.intent.listPermissions",
      "workflowitem.intent.grantPermission",
      "workflowitem.intent.revokePermission"
    ]
  }
];
