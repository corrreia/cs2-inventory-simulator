import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ClientOnly } from "remix-utils/client-only";
import { findRequestUser } from "./auth.server";
import { Background } from "./components/background";
import { Header } from "./components/header";
import { Inventory } from "./components/inventory";
import { RootProvider } from "./components/root-context";
import { SyncWarn } from "./components/sync-warn";
import { MAX_INVENTORY_ITEMS } from "./env.server";
import styles from "./tailwind.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles }
];

export async function loader({ request }: LoaderFunctionArgs) {
  return typedjson({
    user: await findRequestUser(request),
    maxInventoryItems: MAX_INVENTORY_ITEMS
  });
}

export default function App() {
  const { maxInventoryItems, user } = useTypedLoaderData<typeof loader>();

  return (
    <RootProvider user={user} maxInventoryItems={maxInventoryItems}>
      <html lang="en" onContextMenu={event => event.preventDefault()}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className="bg-stone-800">
          <Background />
          <Header />
          <SyncWarn />
          <ClientOnly>
            {() => <Inventory />}
          </ClientOnly>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </RootProvider>
  );
}
