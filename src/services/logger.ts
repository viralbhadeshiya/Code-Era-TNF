import { FastifyReply, FastifyRequest } from 'fastify';
import pino from 'pino';
import Config from '../environment/index';

// Logger serializer
export const debugConfig = {
    res(reply: FastifyReply) {
        if (Config.DEBUG_MODE === 'false') {
            return;
        }
        // eslint-disable-next-line consistent-return
        return {
            statusCode: reply.statusCode,
        };
    },
    req(request: FastifyRequest) {
        if (Config.DEBUG_MODE === 'false') {
            return;
        }
        // eslint-disable-next-line consistent-return
        return {
            method: request.method,
            url: request.url,
            parameters: request.params,
            // Including the headers in the log could be in violation
            // of privacy laws, e.g. GDPR. You should use the "redact" option to
            // remove sensitive fields. It could also leak authentication data in
            // the logs.
            headers: request.headers,
            hostname: request.hostname,
            remoteAddress: request.ip,
            remotePort: request.socket.remotePort,
        };
    },
};

// Logger config according to env
export const logger = {
    local: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
        level: Config.LOG_LEVEL,
        customSuccessMessage(res) {
            return `Request completed with statusCode ${res.statusCode}`;
        },
        customErrorMessage(error) {
            return error.message;
        },
        customAttributeKeys: {
            req: 'HTTP_Request',
            res: 'HTTP_Response',
            err: 'HTTP_Error',
            responseTime: 'Execute_Time',
        },
        serializers: debugConfig,
    },
    development: {
        redact: ['req.headers.authorization'],
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
        level: Config.LOG_LEVEL,
        customSuccessMessage(res) {
            return `Request completed with statusCode ${res.statusCode}`;
        },
        customErrorMessage(error) {
            return error.message;
        },
        customAttributeKeys: {
            req: 'HTTP_Request',
            res: 'HTTP_Response',
            err: 'HTTP_Error',
            responseTime: 'Execute_Time',
        },
        serializers: debugConfig,
    },
    production: {
        redact: ['req.headers.authorization'],
        formatters: {
            level(level) {
                return { level };
            },
        },
        timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
        serializers: debugConfig,

        customSuccessMessage(res) {
            return `Request completed with statusCode ${res.statusCode}`;
        },
        customErrorMessage(error) {
            return error.message;
        },
        customAttributeKeys: {
            req: 'HTTP_Request',
            res: 'HTTP_Response',
            err: 'HTTP_Error',
            responseTime: 'Execute_Time',
        },
        level: Config.LOG_LEVEL,
    },
};

// External logger to use out of api scope
export const externalLogger = pino(logger[Config.NODE_ENV]);
