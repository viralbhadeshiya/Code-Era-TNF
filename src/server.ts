import server from './app';
import Config from './environment/index';

server().then(async app => {
    app.listen(Config.APP_PORT).then(() => {
        app.log.info(`Listening on port ${Config.APP_PORT}, PID: ${process.pid}`);
    });
});
