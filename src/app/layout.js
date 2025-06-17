import Head from "next/head";
import "./styles/globals.css";

export default function Layout({
  children,
  title = "User Management Dashboard",
}) {
  return (
    <html>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="User Management Dashboard for SCSK Europe"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
