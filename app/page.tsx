export default async function Page() {
  return (
    <main className="bg-muted w-full h-full">
      <header className="w-full h-16 bg-white border-b">
        <div className="flex flex-col justify-center w-full h-full px-5 text-primary">
          <ul className="flex items-center gap-3">
            <li className="text-sm font-medium cursor-pointer hover:opacity-100">
              Dashboard
            </li>
          </ul>
        </div>
      </header>
    </main>
  );
}
