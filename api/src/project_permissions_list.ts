import { FastifyInstance } from "fastify";

import { toHttpError } from "./http_errors";
import * as NotAuthenticated from "./http_errors/not_authenticated";
import { AuthenticatedRequest } from "./httpd/lib";
import { Ctx } from "./lib/ctx";
import { isNonemptyString } from "./lib/validation";
import * as Result from "./result";
import { ServiceUser } from "./service/domain/organization/service_user";
import { Permissions } from "./service/domain/permissions";

function mkSwaggerSchema(server: FastifyInstance) {
  return {
    beforeHandler: [(server as any).authenticate],
    description: "See the permissions for a given project.",
    tags: ["project"],
    summary: "List all permissions",
    querystring: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
        },
      },
    },
    security: [
      {
        bearerToken: [],
      },
    ],
    response: {
      200: {
        description: "successful response",
        type: "object",
        properties: {
          apiVersion: { type: "string", example: "1.0" },
          data: {
            type: "object",
            additionalProperties: true,
            example: {
              "project.viewDetails": ["aSmith", "jDoe"],
            },
          },
        },
      },
      401: NotAuthenticated.schema,
    },
  };
}

interface Service {
  getProjectPermissions(
    ctx: Ctx,
    user: ServiceUser,
    projectId: string,
  ): Promise<Result.Type<Permissions>>;
}

export function addHttpHandler(server: FastifyInstance, urlPrefix: string, service: Service) {
  server.get(
    `${urlPrefix}/project.intent.listPermissions`,
    mkSwaggerSchema(server),
    async (request, reply) => {
      const ctx: Ctx = { requestId: request.id, source: "http" };

      const user: ServiceUser = {
        id: (request as AuthenticatedRequest).user.userId,
        groups: (request as AuthenticatedRequest).user.groups,
      };

      const projectId = request.query.projectId;
      if (!isNonemptyString(projectId)) {
        reply.status(404).send({
          apiVersion: "1.0",
          error: {
            code: 404,
            message: "required query parameter `projectId` not present (must be non-empty string)",
          },
        });
        return;
      }

      try {
        const projectPermissions = await service.getProjectPermissions(ctx, user, projectId);

        if (Result.isErr(projectPermissions)) {
          projectPermissions.message = `could not list project permissions: ${
            projectPermissions.message
          }`;
          throw projectPermissions;
        }

        const code = 200;
        const body = {
          apiVersion: "1.0",
          data: projectPermissions,
        };
        reply.status(code).send(body);
      } catch (err) {
        const { code, body } = toHttpError(err);
        reply.status(code).send(body);
      }
    },
  );
}
