import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cors from 'fastify-cors';
import graceful from 'fastify-graceful-shutdown';
import helmet from 'fastify-helmet';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import Config from './environment/index';
import routes from './index';
import { externalLogger } from './services/logger';
import { HttpException } from './utils';

async function app() {
    const fastify: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify({
        bodyLimit: 1048576 * 2,
        logger: externalLogger,
        genReqId() {
            // you get access to the req here if you need it - must be a synchronous function
            return uuidv4();
        },
    });
    fastify.setErrorHandler((err: HttpException, request: FastifyRequest, reply: FastifyReply) => {
        let tranceMeta;
        if (err.meta) {
            tranceMeta = { ...err.meta, ...{ traceId: request.id } };
        } else {
            tranceMeta = { traceId: request.id };
        }

        if (err && err.originalError) {
            request.log.error(err.originalError, `${err.message}`);
        } else if (err && err.errorCode) {
            request.log.trace(err, 'EXPLICIT_HANDLE_ERROR');
        } else {
            request.log.debug(`Request url: ${request.raw.url}`);
            request.log.error(err);
        }
        if (err && err.statusCode) {
            reply.status(err.statusCode).send({
                error: err.errorCode,
                message: err.message,
                meta: tranceMeta,
            });
        } else {
            reply.status(500).send({
                error: 'INTERNAL_SERVER_ERROR',
                message: 'An unexpected error occurred.',
                meta: tranceMeta,
            });
        }
    });
    await fastify.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                baseUri: ["'self'"],
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                objectSrc: ["'self'"],
                workerSrc: ["'self'", 'blob:'],
                frameSrc: ["'self'"],
                formAction: ["'self'"],
                upgradeInsecureRequests: [],
            },
        },
    });
    await fastify.register(cors, { origin: '*' });
    await fastify.register(graceful);

    fastify.ready(() => {
        console.log('Routes:', fastify.printRoutes());
    });

    fastify.setNotFoundHandler((request, reply) => {
        fastify.log.debug(`Route not found: ${request.method}:${request.raw.url}`);

        reply.status(404).send({
            errorCode: 'NOT_FOUND',
            message: `Route ${request.method}:${request.raw.url} not found`,
        });
    });
    await fastify.register(routes);

    // Validate request hook => Enable for auth and set auth token

    fastify.addHook('preHandler', (request, reply, done) => {
        if (
            request.headers &&
            request.headers.authorization &&
            request.headers.authorization === Config.SCHEDULER_AUTH_SECERET
        ) {
            done();
        } else {
            reply.status(400).send({
                status: 'UNAUTHORIZED',
            });
        }
    });

    return fastify;
}

export default app;
