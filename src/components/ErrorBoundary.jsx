import { Component } from 'react';
import { Button } from '@/components/ui/button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              ¡Ups! Algo salió mal
            </h1>
            <div className="text-gray-600 mb-4">
              <p className="mb-2">Lo sentimos, ha ocurrido un error inesperado.</p>
              <p className="text-sm text-gray-500">
                Por favor, intenta recargar la página.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Recargar página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

