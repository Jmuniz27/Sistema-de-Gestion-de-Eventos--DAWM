import { supabase } from "../supabase-client.js";

/* === ELEMENTOS === */
const adminsTable = document.getElementById("adminsTable");
const clientesTable = document.getElementById("clientesTable");

const editModal = document.getElementById("editModal");
const cancelEdit = document.getElementById("cancelEdit");
const saveEdit = document.getElementById("saveEdit");
let editId = null;

const editUserModal = document.getElementById("editUserModal");
const cancelEditUser = document.getElementById("cancelEditUser");
const saveEditUser = document.getElementById("saveEditUser");
let editUserId = null;

/* === CARGAR ADMINISTRADORES === */
async function loadUsuarios() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id_usuario, usuario_nombre, usuario_apellido, usuario_email, usuarios_roles(roles(rol_nombre)), estados_generales(estg_nombre)")
    .order('id_usuario', { ascending: true });
  
  if (error) {
    adminsTable.innerHTML = `<tr><td colspan="7">Error: ${error.message}</td></tr>`;
    return;
  }

  adminsTable.innerHTML = data
    .map(
      (u) => `
    <tr>
      <td>${u.id_usuario}</td>
      <td>${u.usuario_nombre}</td>
      <td>${u.usuario_apellido}</td>
      <td>${u.usuario_email}</td>
      <td>${u.usuarios_roles?.[0]?.roles?.rol_nombre || "Sin rol"}</td>
      <td>${u.estados_generales?.estg_nombre || "Sin estado"}</td>
      <td><button class="btn-edit btn-edit-usuario ${u.id_usuario == 1 ? 'btn-disabled' : ''}" data-id="${u.id_usuario}" ${u.id_usuario == 1 ? 'disabled' : ''}>Editar</button></td>
    </tr>
  `
    )
    .join("");
}

/* === CARGAR CLIENTES === */
async function loadClientes() {
  const { data, error } = await supabase
    .from("clientes")
    .select("id_clientes, cli_nombre, cli_apellido, cli_email, cli_celular")
    .order('id_clientes', { ascending: true });

  if (error) {
    clientesTable.innerHTML = `<tr><td colspan="6">Error: ${error.message}</td></tr>`;
    return;
  }

  clientesTable.innerHTML = data
    .map(
      (c) => `
    <tr>
      <td>${c.id_clientes}</td>
      <td>${c.cli_nombre}</td>
      <td>${c.cli_apellido}</td>
      <td>${c.cli_email}</td>
      <td>${c.cli_celular ?? "-"}</td>
      <td><button class="btn-edit btn-edit-cliente" data-id="${c.id_clientes}">Editar</button></td>
    </tr>
  `
    )
    .join("");
}

/* === CARGAR ROLES === */
async function loadRoles() {
  const { data, error } = await supabase
    .from("roles")
    .select("id_rol, rol_nombre");

  if (error) {
    console.error("Error cargando roles:", error);
    return;
  }

  const roleSelect = document.getElementById("editUserRole");
  roleSelect.innerHTML = '<option value="" disabled>Selecciona un rol</option>' +
    data.map(r => `<option value="${r.id_rol}">${r.rol_nombre}</option>`).join("");
}

/* === CARGAR ESTADOS === */
async function loadEstados() {
  const { data, error } = await supabase
    .from("estados_generales")
    .select("id_estado, estg_nombre");

  if (error) {
    console.error("Error cargando estados:", error);
    return;
  }

  const estadoSelect = document.getElementById("editUserEstado");
  estadoSelect.innerHTML = '<option value="" disabled>Selecciona un estado</option>' +
    data.map(e => `<option value="${e.id_estado}">${e.estg_nombre}</option>`).join("");
}

/* === MODAL EDIT USUARIO === */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit-usuario")) {
      editUserId = e.target.dataset.id;
      openEditUser(editUserId);
  }
});

cancelEditUser.onclick = () => editUserModal.classList.remove("active");

async function openEditUser(id) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id_usuario, usuario_nombre, usuario_apellido, usuario_email, usuarios_roles(roles(id_rol, rol_nombre)), estados_generales(id_estado, estg_nombre)")
    .eq("id_usuario", id)
    .single();

  if (error) return alert(error.message);

  document.getElementById("editUserName").value = data.usuario_nombre;
  document.getElementById("editUserLast").value = data.usuario_apellido;
  document.getElementById("editUserEmail").value = data.usuario_email;

  const currentRoleId = data.usuarios_roles?.[0]?.roles?.id_rol || "";
  document.getElementById("editUserRole").value = currentRoleId;

  const currentEstadoId = data.estados_generales?.id_estado || "";
  document.getElementById("editUserEstado").value = currentEstadoId;

  editUserModal.classList.add("active");
}

saveEditUser.onclick = async () => {
  const nombre = document.getElementById("editUserName").value.trim();
  const apellido = document.getElementById("editUserLast").value.trim();
  const email = document.getElementById("editUserEmail").value.trim();
  const roleId = document.getElementById("editUserRole").value;
  const estadoId = document.getElementById("editUserEstado").value;

  if (!nombre || !apellido || !email || !roleId || !estadoId)
    return alert("Completa todos los campos, incluyendo el rol y el estado.");

  // Deshabilitar botón para evitar clics dobles
  saveEditUser.disabled = true;
  saveEditUser.textContent = "Guardando...";

  try {
    // Actualizar usuario
    const { error: userError } = await supabase
      .from("usuarios")
      .update({
        usuario_nombre: nombre,
        usuario_apellido: apellido,
        usuario_email: email,
        id_estado_fk: estadoId,
      })
      .eq("id_usuario", editUserId);

    if (userError) throw new Error("Error al actualizar usuario: " + userError.message);

    // Eliminar rol previo
    const { error: deleteError } = await supabase
      .from("usuarios_roles")
      .delete()
      .eq("id_usuario_fk", editUserId);

    if (deleteError) throw new Error("Error al eliminar rol previo: " + deleteError.message);

    // Asignar nuevo rol
    const { error: insertError } = await supabase
      .from("usuarios_roles")
      .insert({
        id_usuario_fk: editUserId,
        id_rol_fk: roleId,
      });

    if (insertError) throw new Error("Error al asignar nuevo rol: " + insertError.message);

    alert("Usuario actualizado correctamente.");
    editUserModal.classList.remove("active");
    await loadUsuarios();
  } catch (error) {
    alert(error.message);
  } finally {
    // Rehabilitar botón
    saveEditUser.disabled = false;
    saveEditUser.textContent = "Guardar";
  }
};

/* === MODAL EDIT CLIENTE === */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit-cliente")) {
    editId = e.target.dataset.id;
    openEdit(editId);
  }
});

cancelEdit.onclick = () => editModal.classList.remove("active");

async function openEdit(id) {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id_clientes", id)
    .single();

  if (error) return alert(error.message);

  document.getElementById("editName").value = data.cli_nombre;
  document.getElementById("editLast").value = data.cli_apellido;
  document.getElementById("editEmail").value = data.cli_email;
  document.getElementById("editPhone").value = data.cli_celular;

  editModal.classList.add("active");
}

saveEdit.onclick = async () => {
  const nombre = document.getElementById("editName").value.trim();
  const apellido = document.getElementById("editLast").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const celular = document.getElementById("editPhone").value.trim();

  // Deshabilitar botón para evitar clics dobles
  saveEdit.disabled = true;
  saveEdit.textContent = "Guardando...";

  try {
    const { error } = await supabase
      .from("clientes")
      .update({
        cli_nombre: nombre,
        cli_apellido: apellido,
        cli_email: email,
        cli_celular: celular,
      })
      .eq("id_clientes", editId);

    if (error) throw new Error("Error al actualizar: " + error.message);

    alert("Cliente actualizado correctamente.");
    editModal.classList.remove("active");
    await loadClientes();
  } catch (error) {
    alert(error.message);
  } finally {
    // Rehabilitar botón
    saveEdit.disabled = false;
    saveEdit.textContent = "Guardar";
  }
};

/* === TABS === */
document.querySelectorAll(".tab-button").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

/* === INICIALIZAR === */
loadUsuarios();
loadClientes();
loadRoles();
loadEstados();
