import config from './config.json';

const configData = config[process.env.REACT_APP_ENV];
export const { server, client, scroogeServer,scroogeClient,pokerUrl,blackjackUrl,slotUrl,rouletteUrl,stripeKey,BUSD_ADDRESS } = configData;
