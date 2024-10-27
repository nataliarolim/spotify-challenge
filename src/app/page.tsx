
'use client'

export default function Home() {

  const handleLogin = () => {
    window.location.href = '/api/auth'; // Redirect to start auth flow
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Spotify Client</h1>
      <button onClick={handleLogin} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
        Login with Spotify
      </button>
    </div>
  );
}
