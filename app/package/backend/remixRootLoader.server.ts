import type { LoaderFunction } from "@remix-run/node";
import parseRemixContext from "./parseRemixContext.server";

const remixRootLoader = (
  args: Parameters<LoaderFunction>[0] & {
    env?: Record<string, string>;
    data?: { hideLiveReload?: boolean } & Record<string, unknown>;
  }
): ReturnType<LoaderFunction> => {
  const { lambdaContext } = parseRemixContext(args.context);
  const region = lambdaContext.invokedFunctionArn.match(
    /^arn:aws:lambda:([a-z0-9-]+):/
  )?.[1];
  return {
    ENV: {
      API_URL: process.env.API_URL,
      ORIGIN: process.env.ORIGIN,
      NODE_ENV: process.env.NODE_ENV,
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      ...args.env,
    },
    logUrl: `https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#logsV2:log-groups/log-group/${encodeURIComponent(
      lambdaContext.logGroupName
    )}/log-events/${encodeURIComponent(lambdaContext.logStreamName)}`,
    ...args.data,
  };
};

export default remixRootLoader;
