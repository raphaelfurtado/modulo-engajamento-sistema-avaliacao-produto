/** Esqueleto da página do produto enquanto o produto e as avaliações carregam. */
export default function ProductLoading() {
  const block = "rounded-md bg-muted motion-safe:animate-pulse";

  return (
    <div aria-busy="true" className="flex flex-col gap-14 sm:gap-16">
      <output className="sr-only">Carregando o produto…</output>
      <div
        aria-hidden="true"
        className="grid items-start gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14"
      >
        <div className={`aspect-[4/3] rounded-lg ${block}`} />
        <div className="flex flex-col gap-4">
          <div className={`h-10 w-3/4 ${block}`} />
          <div className={`h-5 w-full ${block}`} />
          <div className={`h-5 w-5/6 ${block}`} />
          <div className={`mt-2 h-5 w-28 ${block}`} />
          <div className="mt-4 border-t border-pauta pt-6">
            <div className={`h-24 w-28 rounded-full ${block}`} />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="max-w-3xl">
        <div className={`mb-4 h-8 w-40 ${block}`} />
        <div className="border-t border-pauta">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="grid grid-cols-[3.5rem_minmax(0,1fr)] border-b border-pauta sm:grid-cols-[5rem_minmax(0,1fr)]"
            >
              <div className="border-r border-pauta" />
              <div className="flex flex-col gap-3 py-5 pl-4 sm:pl-6">
                <div className={`h-9 w-40 ${block}`} />
                <div className={`h-4 w-full ${block}`} />
                <div className={`h-4 w-2/3 ${block}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
