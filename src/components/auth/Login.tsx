import Link from "next/link";
import { FC } from "react";

const Login: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Explore SecureOps</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Select a role to preview its dashboard and features directly without logging in:
        </p>
        <div className="grid grid-cols-1 gap-3">
          <Link
            href="/guard/dashboard"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition"
          >
            🛡️ Guard Dashboard
          </Link>
          <Link
            href="/agency/guards"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition"
          >
            🏢 Agency Dashboard
          </Link>
          <Link
            href="/police/dashboard"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition"
          >
            🚓 Police Dashboard
          </Link>
          <Link
            href="/user/dashboard"
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition"
          >
            👤 User Dashboard
          </Link>
        </div>
        <div className="mt-6">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;