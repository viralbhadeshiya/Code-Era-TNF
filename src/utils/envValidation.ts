import { cleanEnv, str, port } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

const env = cleanEnv(process.env, {
    LOG_LEVEL: str({
        default: 'trace',
    }),
    NODE_ENV: str({
        default: 'local',
        choices: ['local', 'development', 'production'],
    }),
    APP_PORT: port({
        default: 4004,
    }),
    DEBUG_MODE: str({
        devDefault: 'true',
        default: 'false',
    }),
    LOCAL: str({
        default: 'mongodb://localhost:27017/',
    }),
    SCHEDULER_AUTH_SECERET: str(),
    BASE_URL: str(),
});

export default env;
