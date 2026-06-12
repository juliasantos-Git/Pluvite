// app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" />
      </div>
    </div>
  );
}