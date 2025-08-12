"use client"

import { useAuth } from '@/lib/use-auth';

export default function AuthTest() {
  const { user, isAuthenticated, isLoading, isValidating, status, error } = useAuth();

  if (isLoading) {
    return <div className="p-4 bg-gray-100 rounded">⏳ Carregando...</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="font-semibold mb-2">🔐 Status de Autenticação</h3>
      <div className="space-y-2 text-sm">
        <div>Status: <span className="font-mono">{status}</span></div>
        <div>Autenticado: {isAuthenticated ? '✅ Sim' : '❌ Não'}</div>
        <div>Validando: {isValidating ? '🔄 Sim' : '✨ Não'}</div>
        {error && <div className="text-red-600">Erro: {error}</div>}
        {user && (
          <div>
            <div>ID: <span className="font-mono">{user.id}</span></div>
            <div>Email: <span className="font-mono">{user.email}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}