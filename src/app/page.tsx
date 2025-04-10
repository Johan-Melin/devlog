import AuthForm from "@/components/AuthForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">DevLog App</h1>
        
        <div className="mb-8">
          <AuthForm />
        </div>
        
        <p className="text-center">
          Your development logging app
        </p>
      </div>
    </main>
  );
}