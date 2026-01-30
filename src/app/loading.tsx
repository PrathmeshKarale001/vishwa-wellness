export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full px-4 text-center">
                {/* Logo or Brand */}
                <div className="mb-8 animate-pulse">
                    <div className="w-24 h-24 mx-auto bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-[var(--color-primary)]/40 rounded-full"></div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-[family-name:var(--font-playfair)] text-[var(--color-navy)] mb-4">
                    Loading...
                </h2>
                <p className="text-[var(--color-navy)]/60">
                    Preparing your sacred experience
                </p>

                {/* Animated Bars */}
                <div className="mt-8 flex gap-2 justify-center">
                    <div className="w-2 h-12 bg-[var(--color-primary)] rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-12 bg-[var(--color-primary)] rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-12 bg-[var(--color-primary)] rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
