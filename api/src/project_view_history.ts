import { FastifyInstance } from "fastify";
import Joi = require("joi");

import { toHttpError } from "./http_errors";
import * as NotAuthenticated from "./http_errors/not_authenticated";
import { AuthenticatedRequest } from "./httpd/lib";
import { Ctx } from "./lib/ctx";
import { isNonemptyString } from "./lib/validation";
import * as Result from "./result";
import { BusinessEvent } from "./service/domain/business_event";
import { ServiceUser } from "./service/domain/organization/service_user";
import * as Project from "./service/domain/workflow/project";
import * as Subproject from "./service/domain/workflow/subproject";
import logger from "./lib/logger";

interface RequestBodyV1 {
  apiVersion: "1.0";
  data: {
    projectId: Project.Id;
  };
}

const requestBodyV1Schema = Joi.object({
  apiVersion: Joi.valid("1.0").required(),
  data: Joi.object({
    projectId: Project.idSchema.required(),
  }),
});

type RequestBody = RequestBodyV1;
const requestBodySchema = Joi.alternatives([requestBodyV1Schema]);

function validateRequestBody(body: any): Result.Type<RequestBody> {
  const { error, value } = Joi.validate(body, requestBodySchema);
  return !error ? value : error;
}

function mkSwaggerSchema(server: FastifyInstance) {
  return {
    beforeHandler: [(server as any).authenticate],
    description:
      "View the history of a given project (filtered by what the user is allowed to see).",
    tags: ["project"],
    summary: "View history",
    querystring: {
      type: "object",
      properties: {
        projectId: {
          type: "string",
        },
        limit: {
          type: "string",
          description: "Limit to the number of events to return.",
          example: "10",
        },
        offset: {
          type: "string",
          description:
            "The index of the first event; any events that follow" +
            "have happened after that first event. The `offset` may also " +
            "be negative. For example, an `offset` of `-10` with limit `10` requests " +
            "the 10 most recent events.",
          example: "0",
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
            properties: {
              events: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: { type: "string" },
                    intent: { type: "string", example: "global.createProject" },
                    createdBy: { type: "string", example: "aSmith" },
                    createdAt: { type: "string", example: "2018-09-05T13:37:25.775Z" },
                    dataVersion: { type: "string", example: "1" },
                    data: {
                      type: "object",
                      additionalProperties: true,
                      example: { identity: "aSmith", intent: "subproject.viewDetails" },
                      properties: {
                        permissions: {
                          type: "object",
                          additionalProperties: true,
                          example: { "subproject.intent.listPermissions": ["aSmith", "jDoe"] },
                        },
                      },
                    },
                    snapshot: {
                      type: "object",
                      properties: {
                        displayName: { type: "string", example: "townproject" },
                      },
                    },
                  },
                },
              },
              historyItemsCount: {
                type: "number",
                example: 10,
              },
            },
          },
        },
      },
      401: NotAuthenticated.schema,
    },
  };
}

interface ExposedEvent {
  entityId: string;
  entityType: "project" | "subproject";
  businessEvent: BusinessEvent;
  snapshot: {
    displayName?: string;
  };
}

interface Service {
  getProject(ctx: Ctx, user: ServiceUser, projectId: string): Promise<Result.Type<Project.Project>>;
  getSubprojects(ctx: Ctx, user: ServiceUser, projectId: string): Promise<Subproject.Subproject[]>;
}

export function addHttpHandler(server: FastifyInstance, urlPrefix: string, service: Service) {
  server.get(
    `${urlPrefix}/project.viewHistory`,
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

      const offset = parseInt(request.query.offset || 0, 10);
      if (isNaN(offset)) {
        reply.status(400).send({
          apiVersion: "1.0",
          error: {
            code: 400,
            message: "if present, the query parameter `offset` must be an integer",
          },
        });
        return;
      }

      let limit: number | undefined = parseInt(request.query.limit, 10);
      if (isNaN(limit)) {
        limit = undefined;
      } else if (limit <= 0) {
        reply.status(400).send({
          apiVersion: "1.0",
          error: {
            code: 400,
            message: "if present, the query parameter `limit` must be a positive integer",
          },
        });
        return;
      }

      try {
        const projectResult = await service.getProject(ctx, user, projectId);
        if (Result.isErr(projectResult)) {
          projectResult.message = `project.viewHistory failed: ${projectResult.message}`;
          throw projectResult;
        }
        const project: Project.Project = projectResult;

        // Add subprojects' logs to the project log and sort by creation time:
        const subprojects = await service.getSubprojects(ctx, user, projectId);
        const events: ExposedEvent[] = project.log;
        for (const subproject of subprojects) {
          events.push(...subproject.log);
        }
        events.sort(byEventTime);

        const offsetIndex = offset < 0 ? Math.max(0, events.length + offset) : offset;
        const slice = events.slice(
          offsetIndex,
          limit === undefined ? undefined : offsetIndex + limit,
        );

        const code = 200;
        const body = {
          apiVersion: "1.0",
          data: {
            events: slice,
            historyItemsCount: events.length,
          },
        };
        reply.status(code).send(body);
      } catch (err) {
        const { code, body } = toHttpError(err);
        reply.status(code).send(body);
      }
    },
  );
}

function byEventTime(a: ExposedEvent, b: ExposedEvent): -1 | 0 | 1 {
  const timeA = new Date(a.businessEvent.time);
  const timeB = new Date(b.businessEvent.time);
  if (timeA < timeB) return -1;
  if (timeA > timeB) return 1;
  return 0;
}
