import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to Admin</h2>
          <p className="mt-2 text-center text-sm text-gray-900">Please enter your super secret credentials</p>
        </div>
        {params.error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">Invalid username or password.</p>
          </div>
        )}
        <form className="mt-8 space-y-6" action={async (formData) => {
          "use server";
          try {
            await signIn("credentials", formData);
          } catch (error) {
            if (error instanceof AuthError) {
              redirect("/auth/signin?error=1");
            }
            throw error; // Rethrow to let Next.js handle NEXT_REDIRECT properly
          }
        }}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input id="username" name="username" type="text" required className="relative block w-full rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Username" />
            </div>
            <div>
              <input id="password" name="password" type="password" required className="relative block w-full rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Password" />
            </div>
          </div>
          <div>
            <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  );
}