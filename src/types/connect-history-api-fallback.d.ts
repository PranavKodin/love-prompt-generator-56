
declare module 'connect-history-api-fallback' {
  import { RequestHandler } from 'express';
  
  interface HistoryOptions {
    disableDotRule?: boolean;
    htmlAcceptHeaders?: string[];
    index?: string;
    verbose?: boolean;
    logger?: Console;
    rewrites?: Array<{
      from: RegExp;
      to: string | Function;
    }>;
  }
  
  const historyApiFallback: (options?: HistoryOptions) => RequestHandler;
  export default historyApiFallback;
}
