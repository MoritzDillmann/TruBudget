import * as Global from "..";
import { throwIfUnauthorized } from "../../authz";
import Intent, { userAssignableIntents } from "../../authz/intents";
import { AuthenticatedRequest, HttpResponse } from "../../httpd/lib";
import logger from "../../lib/logger";
import { isNonemptyString, value } from "../../lib/validation";
import { MultichainClient } from "../../multichain/Client.h";

export const grantAllPermissions = async (
  multichain: MultichainClient,
  req: AuthenticatedRequest,
): Promise<HttpResponse> => {
  const input = value("data", req.body.data, x => x !== undefined);

  const identity: string = value("identity", input.identity, isNonemptyString);

  const userIntent: Intent = "global.grantPermission";
  await throwIfUnauthorized(req.user, userIntent, await Global.getPermissions(multichain));

  for (const intent of userAssignableIntents) {
    logger.debug({ identity, intent }, "Granting all permissions.");
    await Global.grantPermission(multichain, identity, intent);
  }

  return [
    200,
    {
      apiVersion: "1.0",
      data: "OK",
    },
  ];
};
