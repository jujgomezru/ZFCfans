class CoctelBuilder {
  constructor() {
    this.coctel = {
      nombre: '',
      descripcion: '',
      ingredientes: [],
      instrucciones: '',
      categoria: null,
      dificultad: 1,
      tiempo_preparacion: null,
      imagen_url: null,
      vaso: null,
      is_alcoholic: true,
      user_id: 1,
    };
  }

  setNombre(nombre) {
    this.coctel.nombre = nombre;
    return this;
  }

  setDescripcion(descripcion) {
    this.coctel.descripcion = descripcion;
    return this;
  }

  addIngrediente(nombre, cantidad, unidad = '') {
    this.coctel.ingredientes.push({
      nombre,
      cantidad,
      unidad,
    });
    return this;
  }

  setInstrucciones(instrucciones) {
    this.coctel.instrucciones = instrucciones;
    return this;
  }

  setCategoria(categoria) {
    this.coctel.categoria = categoria;
    return this;
  }

  setDificultad(dificultad) {
    this.coctel.dificultad = dificultad;
    return this;
  }

  setTiempoPreparacion(tiempo) {
    this.coctel.tiempo_preparacion = tiempo;
    return this;
  }

  setImagenUrl(url) {
    this.coctel.imagen_url = url;
    return this;
  }

  setVaso(vaso) {
    this.coctel.vaso = vaso;
    return this;
  }

  setAlcoholico(esAlcoholico) {
    this.coctel.is_alcoholic = esAlcoholico;
    return this;
  }

  setUserId(userId) {
    this.coctel.user_id = userId;
    return this;
  }

  build() {
    // Validar que tenga nombre y al menos un ingrediente
    if (!this.coctel.nombre) {
      throw new Error('El cóctel debe tener un nombre');
    }
    if (this.coctel.ingredientes.length === 0) {
      throw new Error('El cóctel debe tener al menos un ingrediente');
    }

    return { ...this.coctel };
  }
}

export default CoctelBuilder;
