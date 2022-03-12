import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

/**
 * Controller sample home function
 */
const homeFunction = async (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
    request.log.info('Request received');
    const uniqueId = uuidv4();
    return reply.code(200).send({
        uniqueId,
    });
};

export { homeFunction };
