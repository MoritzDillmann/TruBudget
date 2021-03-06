import { VError } from "verror";

import { Ctx } from "../../../lib/ctx";
import * as Result from "../../../result";
import { BusinessEvent } from "../business_event";
import { InvalidCommand } from "../errors/invalid_command";
import { NotAuthorized } from "../errors/not_authorized";
import { NotFound } from "../errors/not_found";
import { Identity } from "../organization/identity";
import { ServiceUser } from "../organization/service_user";
import * as UserRecord from "../organization/user_record";
import * as NotificationCreated from "./notification_created";
import * as Project from "./project";
import * as Subproject from "./subproject";
import * as SubprojectAssigned from "./subproject_assigned";

interface Repository {
  getSubproject(): Promise<Result.Type<Subproject.Subproject>>;
  getUsersForIdentity(identity: Identity): Promise<UserRecord.Id[]>;
}

export async function assignSubproject(
  ctx: Ctx,
  issuer: ServiceUser,
  projectId: Project.Id,
  subprojectId: Subproject.Id,
  assignee: Identity,
  repository: Repository,
): Promise<Result.Type<{ newEvents: BusinessEvent[]; subproject: Subproject.Subproject }>> {
  let subproject = await repository.getSubproject();
  if (Result.isErr(subproject)) {
    return new NotFound(ctx, "subproject", subprojectId);
  }

  if (subproject.assignee === assignee) {
    // This is already assigned to that user.
    return { newEvents: [], subproject };
  }

  // Create the new event:
  const subprojectAssigned = SubprojectAssigned.createEvent(
    ctx.source,
    issuer.id,
    projectId,
    subprojectId,
    assignee,
  );
  if (Result.isErr(subprojectAssigned)) {
    return new VError(subprojectAssigned, "failed to create event");
  }

  // Check authorization (if not root):
  if (issuer.id !== "root") {
    if (!Subproject.permits(subproject, issuer, ["subproject.assign"])) {
      return new NotAuthorized(ctx, issuer.id, subprojectAssigned);
    }
  }

  // Check that the new event is indeed valid:
  const result = SubprojectAssigned.apply(ctx, subprojectAssigned, subproject);
  if (Result.isErr(result)) {
    return new InvalidCommand(ctx, subprojectAssigned, [result]);
  }
  subproject = result;

  // Create notification events:
  const recipients = await repository.getUsersForIdentity(assignee);
  const notifications = recipients
    // The issuer doesn't receive a notification:
    .filter(userId => userId !== issuer.id)
    .map(recipient =>
      NotificationCreated.createEvent(
        ctx.source,
        issuer.id,
        recipient,
        subprojectAssigned,
        projectId,
        subprojectId,
      ),
    );

  return { newEvents: [subprojectAssigned, ...notifications], subproject };
}
