import Head from "next/head";

export default function Layout({
  children,
  title = "User Management Dashboard",
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="User Management Dashboard for SCSK Europe"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-2xl font-bold text-gray-900">
                User Management Dashboard
              </h1>
              <div className="text-sm text-gray-500">SCSK Europe</div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </>
  );
}
