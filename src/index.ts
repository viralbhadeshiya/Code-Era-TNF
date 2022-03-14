import * as apiComponent from './components/index';

export default async app => {
    app.register(apiComponent.gatewayComponent.gatewayRoutes);
};
