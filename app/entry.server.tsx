import type { EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToReadableStream } from "react-dom/server";

const ABORT_DELAY = 5000;

const handleRequest = async (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) => {
  let didError = false;

  let start = Date.now();
  const stream = await renderToReadableStream(
    <RemixServer
      context={remixContext}
      url={request.url}
      abortDelay={ABORT_DELAY}
    />,
    {
      onError: (error: unknown) => {
        console.log("Caught an error");
        didError = true;
        console.error(error);

        // You can also log crash/error report
      },
      signal: AbortSignal.timeout(ABORT_DELAY),
    },
  );

  if (isbot(request.headers.get("user-agent"))) {
    await stream.allReady;
  }

  let time = Date.now() - start;
  responseHeaders.append("Server-Timing", `shell-render;dur=${time}`);
  responseHeaders.set("Transfer-Encoding", "chunked");
  responseHeaders.set("Content-Type", "text/html");

  return new Response(stream, {
    headers: responseHeaders,
    status: didError ? 500 : responseStatusCode,
  });
};

export default handleRequest;
