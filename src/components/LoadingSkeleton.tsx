interface LoadingSkeletonProps {
  count?: number;
}

function CollegeCardSkeleton() {
  return (
    <div className="flex h-full min-h-[31rem] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-pulse">
      <div className="relative h-36 w-full bg-slate-200 sm:h-40">
        <div className="absolute left-2 top-2 flex gap-1.5">
          <div className="h-4 w-12 rounded bg-white/70" />
          <div className="h-4 w-16 rounded bg-slate-900/20" />
        </div>

        <div className="absolute right-2 top-2 flex gap-1.5">
          <div className="h-5 w-9 rounded-full bg-white/80" />
          <div className="h-6 w-6 rounded-md bg-white/80" />
        </div>

        <div className="absolute bottom-2 left-2 space-y-2">
          <div className="h-4 w-44 max-w-[70vw] rounded bg-white/80" />
          <div className="h-3 w-28 rounded bg-white/60" />
        </div>

        <div className="absolute bottom-2 right-2 h-4 w-16 rounded bg-black/25" />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <div className="h-5 w-11/12 rounded bg-slate-200" />
            <div className="h-5 w-4/5 rounded bg-slate-200" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-5/6 rounded bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200/60 bg-slate-50 p-3">
            <div className="space-y-2">
              <div className="h-2.5 w-10 rounded bg-slate-200" />
              <div className="h-4 w-14 rounded bg-slate-200" />
            </div>
            <div className="space-y-2">
              <div className="h-2.5 w-12 rounded bg-slate-200" />
              <div className="h-4 w-16 rounded bg-slate-200" />
            </div>
            <div className="space-y-2">
              <div className="h-2.5 w-12 rounded bg-slate-200" />
              <div className="h-4 w-14 rounded bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
          <div className="h-10 flex-1 rounded-lg bg-slate-200" />
          <div className="h-10 flex-1 rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ count = 6 }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {skeletons.map((_, idx) => (
        <CollegeCardSkeleton key={idx} />
      ))}
    </div>
  );
}
