import { FC } from "react";
import { Info } from "lucide-react";

interface ErrorStateProps {
  error: string | null;
}

const ErrorState: FC<ErrorStateProps> = ({ error }) => {
  return (
    <section className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <Info className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Not found</h2>
        <p className="text-gray-600">{error || "Product not found."}</p>
      </div>
    </section>
  );
};

export default ErrorState;