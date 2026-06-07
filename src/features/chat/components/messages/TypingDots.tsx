'use client';

export function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1.5" role="status" aria-label="Assistente digitando">
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:-300ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:-150ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-bounce" />
    </div>
  );
}
