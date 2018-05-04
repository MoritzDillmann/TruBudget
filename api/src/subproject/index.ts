import { getAllowedIntents } from "../authz/index";
import Intent from "../authz/intents";
import { AuthToken } from "../authz/token";
import { AllowedUserGroupsByIntent, People } from "../authz/types";
import { MultichainClient, Resource } from "../multichain/Client.h";

/** The multichain-item key used to identify subprojects. */
const SUBPROJECTS_KEY = "subprojects";

export interface SubprojectResource extends Resource {
  data: SubprojectData;
}

export interface SubprojectData {
  id: string;
  creationUnixTs: string;
  status: "open" | "closed";
  displayName: string;
  description: string;
  amount: string;
  assignee?: string;
  currency: string;
}

export interface SubprojectDataWithIntents extends SubprojectData {
  allowedIntents: Intent[];
}

// Allows a custom ordering among workflowitems. Note that not all workflowitems need
// to be included; those that aren't are simply ordered by their ctime and concatenated
// to what's specified here.
export type WorkflowitemOrdering = string[];
export interface WorkflowitemOrderingResource extends Resource {
  data: WorkflowitemOrdering;
}
const workflowitemOrderingKey = "workflowitem_ordering";

export const getPermissions = async (
  multichain: MultichainClient,
  projectId: string,
  subprojectId: string,
): Promise<AllowedUserGroupsByIntent> => {
  const streamItem = await multichain.getValue(projectId, subprojectId);
  return streamItem.resource.permissions;
};

export const grantPermission = async (
  multichain: MultichainClient,
  projectId: string,
  subprojectId: string,
  userId: string,
  intent: Intent,
): Promise<void> => {
  await multichain.updateValue(projectId, subprojectId, (subproject: Resource) => {
    const permissionsForIntent: People = subproject.permissions[intent] || [];
    if (!permissionsForIntent.includes(userId)) {
      permissionsForIntent.push(userId);
      subproject.permissions[intent] = permissionsForIntent;
    }
    return subproject;
  });
};

export const revokePermission = async (
  multichain: MultichainClient,
  projectId: string,
  subprojectId: string,
  userId: string,
  intent: Intent,
): Promise<void> => {
  await multichain.updateValue(projectId, subprojectId, (subproject: Resource) => {
    const permissionsForIntent: People = subproject.permissions[intent] || [];
    const userIndex = permissionsForIntent.indexOf(userId);
    if (userIndex === -1) {
      // Remove the user from the array:
      permissionsForIntent.splice(userIndex, 1);
      subproject.permissions[intent] = permissionsForIntent;
    }
    return subproject;
  });
};

export const create = async (
  multichain: MultichainClient,
  token: AuthToken,
  projectId: string,
  data: SubprojectData,
  permissions: AllowedUserGroupsByIntent,
): Promise<void> => {
  const subprojectId = data.id;
  const resource: SubprojectResource = {
    data,
    log: [
      {
        // not taken from data in case subprojects are created after the fact, as
        // the log entry's ctime should always be the actual time of creation:
        creationUnixTs: Date.now().toString(),
        issuer: token.userId,
        action: "subproject_created",
      },
    ],
    permissions,
  };
  return multichain.setValue(projectId, [SUBPROJECTS_KEY, subprojectId], resource);
};

export const get = async (
  multichain: MultichainClient,
  projectId: string,
  subprojectId: string,
): Promise<SubprojectData> => {
  const streamItem = await multichain.getValue(projectId, subprojectId);
  return streamItem.resource.data;
};

export const getForUser = async (
  multichain: MultichainClient,
  token: AuthToken,
  projectId: string,
  subprojectId: string,
): Promise<SubprojectDataWithIntents> => {
  const streamItem = await multichain.getValue(projectId, subprojectId);
  const resource = streamItem.resource;
  return {
    ...resource.data,
    allowedIntents: await getAllowedIntents(token, resource.permissions),
  };
};

export const getAll = async (
  multichain: MultichainClient,
  projectId: string,
): Promise<SubprojectResource[]> => {
  const streamItems = await multichain.getLatestValues(projectId, SUBPROJECTS_KEY);
  return streamItems.map(item => item.resource);
};

export const assign = async (
  multichain: MultichainClient,
  projectId: string,
  subprojectId: string,
  userId: string,
): Promise<void> => {
  await multichain.updateValue(projectId, subprojectId, (subproject: SubprojectResource) => {
    subproject.data.assignee = userId;
    return subproject;
  });
};

export const getAllForUser = async (
  multichain: MultichainClient,
  token: AuthToken,
  projectId: string,
): Promise<SubprojectDataWithIntents[]> => {
  const resources = await getAll(multichain, projectId);
  const allSubprojects = await Promise.all(
    resources.map(async resource => {
      return {
        ...resource.data,
        allowedIntents: await getAllowedIntents(token, resource.permissions).catch(err => {
          console.log(
            `WARN: Could not fetch allowed intents: token=${token} resource=${JSON.stringify(
              resource,
            )}`,
          );
          const nothing: Intent[] = [];
          return nothing;
        }),
      };
    }),
  );
  const allowedToSeeIntents: Intent[] = ["subproject.viewSummary", "subproject.viewDetails"];
  const clearedSubprojects = allSubprojects.filter(subproject =>
    subproject.allowedIntents.some(intent => allowedToSeeIntents.includes(intent)),
  );
  return clearedSubprojects;
};

export const getWorkflowitemOrdering = (
  multichain: MultichainClient,
  projectId: string,
): Promise<WorkflowitemOrdering> =>
  multichain
    .getValue(projectId, workflowitemOrderingKey)
    .then(streamItem => streamItem.resource.data)
    .catch(err => {
      if (err.kind === "NotFound") {
        return [];
      } else {
        throw err;
      }
    });

export const setWorkflowitemOrdering = async (
  multichain: MultichainClient,
  projectId: string,
  ordering: WorkflowitemOrdering,
): Promise<void> => {
  const resource: WorkflowitemOrderingResource = {
    data: ordering,
    log: [],
    permissions: {},
  };
  return multichain.setValue(projectId, [workflowitemOrderingKey], resource);
};

/*
 * higher-level
 */

export const isClosed = async (
  multichain: MultichainClient,
  projectId: string,
  subprojectId: string,
): Promise<boolean> => {
  return get(multichain, projectId, subprojectId).then(
    subproject => subproject.status === "closed",
  );
};
