import { useState } from 'react';

// Componente de prueba simple para diagnosticar el problema
function TestInput() {
  const [value, setValue] = useState('');

  return (
    <div className="p-4 border border-red-500 rounded bg-red-50">
      <h3 className="text-lg font-bold text-red-800 mb-2">Componente de Prueba</h3>
      <input
        type="text"
        value={value}
        onChange={e => {
          console.log('TestInput onChange:', e.target.value);
          setValue(e.target.value);
        }}
        placeholder="Si puedes escribir aquí, el problema está en los props"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
      />
      <p className="text-sm text-red-700 mt-2">Valor actual: "{value}"</p>
    </div>
  );
}

export default TestInput;
