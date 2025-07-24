import React from 'react';

function CrearPage() {
  // Estado para los campos del formulario
  const [form, setForm] = React.useState({
    name: '',
    difficulty: '',
    img_url: '',
    description: '',
    preparation_time: '',
    servings: 1,
    alcohol_content: '',
    glass_type: '',
    garnish: '',
    serving_suggestion: '',
    ingredientes: [{ id: Date.now() + Math.random(), name: '', quantity: '', unit: '' }],
    pasos: [{ id: Date.now() + Math.random(), instruction: '', duration: '' }],
    id_category: '',
  });

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Manejar ingredientes dinámicos
  const handleIngredientChange = (id, field, value) => {
    const newIngredients = form.ingredientes.map(ing =>
      ing.id === id ? { ...ing, [field]: value } : ing,
    );
    setForm(prev => ({ ...prev, ingredientes: newIngredients }));
  };
  const addIngredient = () => {
    setForm(prev => ({
      ...prev,
      ingredientes: [
        ...prev.ingredientes,
        { id: Date.now() + Math.random(), name: '', quantity: '', unit: '' },
      ],
    }));
  };

  // Manejar pasos dinámicos
  const handleStepChange = (id, field, value) => {
    const newSteps = form.pasos.map(step =>
      step.id === id ? { ...step, [field]: value } : step,
    );
    setForm(prev => ({ ...prev, pasos: newSteps }));
  };
  const addStep = () => {
    setForm(prev => ({
      ...prev,
      pasos: [
        ...prev.pasos,
        { id: Date.now() + Math.random(), instruction: '', duration: '' },
      ],
    }));
  };

  // Manejar envío: enviar datos al main process por IPC
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("➡️ Enviando datos del cóctel al proceso principal:", form);
    try {
      const res = await window.electronAPI.crearCoctel(form);
      if (res.ok) {
        alert(`Cóctel creado con éxito. ID: ${res.id}`);
        // Opcional: limpiar el formulario o redirigir
      } else {
        alert(`Error al crear cóctel: ${res.error}`);
      }
    } catch (err) {
      alert(`Error de comunicación: ${err.message}`);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FDFBF8] flex items-center justify-between mb-4 p-8 border-b border-gray-200/30">
        <h2 className="text-4xl font-bold text-gray-800">Crear Cóctel</h2>
      </div>

      {/* Formulario */}
      <div className="p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700">Nombre *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Dificultad *</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange} required className="input">
              <option value="">Selecciona...</option>
              <option value="fácil">Fácil</option>
              <option value="media">Media</option>
              <option value="difícil">Difícil</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Imagen (URL)</label>
            <input name="img_url" value={form.img_url} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="input" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium text-gray-700">Tiempo de preparación (min)</label>
              <input name="preparation_time" type="number" min="1" value={form.preparation_time} onChange={handleChange} className="input" />
            </div>
            <div className="flex-1">
              <label className="block font-medium text-gray-700">Porciones</label>
              <input name="servings" type="number" min="1" value={form.servings} onChange={handleChange} className="input" />
            </div>
            <div className="flex-1">
              <label className="block font-medium text-gray-700">Alcohol (%)</label>
              <input name="alcohol_content" type="number" min="0" max="100" value={form.alcohol_content} onChange={handleChange} className="input" />
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Tipo de vaso</label>
            <input name="glass_type" value={form.glass_type} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Decoración</label>
            <input name="garnish" value={form.garnish} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Sugerencia de servicio</label>
            <input name="serving_suggestion" value={form.serving_suggestion} onChange={handleChange} className="input" />
          </div>
          {/* Ingredientes */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Ingredientes</label>
            {form.ingredientes.map(ing => (
              <div key={ing.id} className="flex gap-2 mb-2">
                <input placeholder="Nombre" value={ing.name} onChange={e => handleIngredientChange(ing.id, 'name', e.target.value)} className="input flex-1" />
                <input placeholder="Cantidad" type="number" min="0" value={ing.quantity} onChange={e => handleIngredientChange(ing.id, 'quantity', e.target.value)} className="input w-24" />
                <input placeholder="Unidad" value={ing.unit} onChange={e => handleIngredientChange(ing.id, 'unit', e.target.value)} className="input w-24" />
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="text-green-700 font-medium mt-2">+ Añadir ingrediente</button>
          </div>
          {/* Pasos */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Pasos de preparación</label>
            {form.pasos.map((step, idx) => (
              <div key={step.id} className="flex gap-2 mb-2">
                <input placeholder={`Paso ${idx + 1}`} value={step.instruction} onChange={e => handleStepChange(step.id, 'instruction', e.target.value)} className="input flex-1" />
                <input placeholder="Duración (seg)" type="number" min="0" value={step.duration} onChange={e => handleStepChange(step.id, 'duration', e.target.value)} className="input w-32" />
              </div>
            ))}
            <button type="button" onClick={addStep} className="text-green-700 font-medium mt-2">+ Añadir paso</button>
          </div>
          {/* Categoría principal */}
          <div>
            <label className="block font-medium text-gray-700">Categoría principal</label>
            <input name="id_category" value={form.id_category} onChange={handleChange} className="input" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold mt-4">Crear Cóctel</button>
        </form>
      </div>
    </>
  );
}

export default CrearPage;
