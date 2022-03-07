import { cleanEnv, str, port } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

const env = cleanEnv(process.env, {
    LOG_LEVEL: str({
        default: 'trace',
    }),
    NODE_ENV: str({
        default: 'local',
        choices: ['local', 'development', 'staging', 'production'],
    }),
    APP_PORT: port({
        default: 4004,
    }),
    DEBUG_MODE: str({
        devDefault: 'true',
        default: 'false',
    }),
    LOCAL: str({
        desc: 'Local mongodb url',
        default: 'mongodb://localhost:27017/',
    }),
    SCHEDULER_AUTH_SECERET: str({
        desc: 'Auth token to make api call for scheduler',
    }),
    BASE_URL: str({
        desc: 'Host address of current app to make internal call',
    }),
});

export default env;
