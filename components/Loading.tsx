"use client";

export function LoadingDots() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex space-x-1">
        <span
          className="loading-dot animate-bounce"
          style={{ "--delay": "0s" } as React.CSSProperties}
        />
        <span
          className="loading-dot animate-bounce"
          style={{ "--delay": "0.2s" } as React.CSSProperties}
        />
        <span
          className="loading-dot animate-bounce"
          style={{ "--delay": "0.4s" } as React.CSSProperties}
        />
      </div>
      <p className="text-sm text-gray-200">Generating book content</p>
    </div>
  );
}
