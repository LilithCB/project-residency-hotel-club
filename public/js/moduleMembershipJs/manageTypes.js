document.addEventListener('DOMContentLoaded', () => {
  // --- LÓGICA PARA TIPOS DE MEMBRESÍA ---
  const tipoMembresiaModal = document.getElementById('tipoMembresiaModal');
  const addTipoMembresiaBtn = document.getElementById('addTipoMembresiaBtn');
  const cancelTipoBtn = document.getElementById('cancelTipoBtn');
  const tipoMembresiaForm = document.getElementById('tipoMembresiaForm');
  const tiposMembresiaTableBody = document.getElementById('tiposMembresiaTableBody');

  const openTipoModal = (data = {}) => {
    tipoMembresiaForm.reset();
    document.getElementById('tipoId').value = data.id_tipo_membresia || '';
    document.getElementById('tipoNombre').value = data.nombre || '';
    document.getElementById('tipoDescripcion').value = data.descripcion || '';
    document.getElementById('tipoMaxIntegrantes').value = data.max_integrantes || '';
    document.getElementById('tipoPrecio').value = data.precio || '';
    document.getElementById('tipoModalTitleText').textContent = data.id_tipo_membresia ? 'Editar Tipo de Membresía' : 'Nuevo Tipo de Membresía';
    tipoMembresiaModal.classList.remove('hidden');
  };

  const closeTipoModal = () => tipoMembresiaModal.classList.add('hidden');

  addTipoMembresiaBtn.addEventListener('click', () => openTipoModal());
  cancelTipoBtn.addEventListener('click', closeTipoModal);

  tiposMembresiaTableBody.addEventListener('click', (event) => {
    const editBtn = event.target.closest('.edit-tipo-btn');
    if (editBtn) {
      const row = editBtn.closest('tr');
      const data = {
        id_tipo_membresia: row.dataset.id,
        nombre: row.cells[0].textContent,
        descripcion: row.cells[1].textContent,
        max_integrantes: row.cells[2].textContent,
        precio: parseFloat(row.cells[3].textContent.replace('$', '')),
      };
      openTipoModal(data);
    }
  });

  tipoMembresiaForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('tipoId').value;
    const formData = new FormData(tipoMembresiaForm);
    const data = Object.fromEntries(formData.entries());

    const url = id ? `/memberships/api/types/${id}` : '/memberships/api/types';
    const method = id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert('Error de conexión al guardar el tipo de membresía.');
    }
  });

  // --- LÓGICA PARA MÉTODOS DE PAGO ---
  const metodoPagoModal = document.getElementById('metodoPagoModal');
  const addMetodoPagoBtn = document.getElementById('addMetodoPagoBtn');
  const cancelMetodoBtn = document.getElementById('cancelMetodoBtn');
  const metodoPagoForm = document.getElementById('metodoPagoForm');
  const metodosPagoTableBody = document.getElementById('metodosPagoTableBody');

  const openMetodoModal = (data = {}) => {
    metodoPagoForm.reset();
    document.getElementById('metodoId').value = data.id_metodo_pago || '';
    document.getElementById('metodoNombre').value = data.nombre || '';
    document.getElementById('metodoModalTitleText').textContent = data.id_metodo_pago ? 'Editar Método de Pago' : 'Nuevo Método de Pago';
    metodoPagoModal.classList.remove('hidden');
  };

  const closeMetodoModal = () => metodoPagoModal.classList.add('hidden');

  addMetodoPagoBtn.addEventListener('click', () => openMetodoModal());
  cancelMetodoBtn.addEventListener('click', closeMetodoModal);

  metodosPagoTableBody.addEventListener('click', (event) => {
    const editBtn = event.target.closest('.edit-metodo-btn');
    if (editBtn) {
      const row = editBtn.closest('tr');
      const data = {
        id_metodo_pago: row.dataset.id,
        nombre: row.cells[0].textContent,
      };
      openMetodoModal(data);
    }
  });

  metodoPagoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('metodoId').value;
    const formData = new FormData(metodoPagoForm);
    const data = Object.fromEntries(formData.entries());

    const url = id ? `/memberships/api/payment-methods/${id}` : '/memberships/api/payment-methods';
    const method = id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert('Error de conexión al guardar el método de pago.');
    }
  });

  // --- LÓGICA PARA ELIMINACIÓN (COMÚN) ---
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteConfirmMessage = document.getElementById('deleteConfirmMessage');
  let deleteUrl = '';

  const openDeleteModal = (url, nombre) => {
    deleteUrl = url;
    deleteConfirmMessage.textContent = `¿Estás seguro de que deseas eliminar "${nombre}"? Esta acción no se puede deshacer.`;
    deleteConfirmModal.classList.remove('hidden');
  };

  const closeDeleteModal = () => deleteConfirmModal.classList.add('hidden');

  cancelDeleteBtn.addEventListener('click', closeDeleteModal);

  tiposMembresiaTableBody.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.delete-tipo-btn');
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      const nombre = deleteBtn.dataset.nombre;
      openDeleteModal(`/memberships/api/types/${id}`, nombre);
    }
  });

  metodosPagoTableBody.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.delete-metodo-btn');
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      const nombre = deleteBtn.dataset.nombre;
      openDeleteModal(`/memberships/api/payment-methods/${id}`, nombre);
    }
  });

  confirmDeleteBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(deleteUrl, { method: 'DELETE' });
      if (response.ok) {
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert('Error de conexión al eliminar.');
    }
  });
});
