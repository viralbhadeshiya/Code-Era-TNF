import * as gatewayController from './gateway.controller';

export default async app => {
    app.get('/home', gatewayController.homeFunction);
};
