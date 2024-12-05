import { analytics } from "./analytics";

export const log = (message: any) => {
    console.log(message);
  };
  
  export const track = (event: string, message: any) => {
    console.log(event, message);
    analytics.track(event, {
      event: event,
      message: message,
    });
    console.log('Analytics...');
  };
  