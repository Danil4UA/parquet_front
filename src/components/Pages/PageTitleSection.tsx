export default function PageTitleSection({
    title
}: {
    title: string
}) {
    return (
        <div className="relative overflow-hidden bg-gray-900 text-center p-4">
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
            <div className="relative z-10 h-full flex items-center justify-center">
                <div className="container mx-auto px-2 sm:px-6 lg:px-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                        {title}
                    </h1>
                </div>
            </div>
        </div>
    )
};