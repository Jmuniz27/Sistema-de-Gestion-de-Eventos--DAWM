import { supabase } from "../supabase-client.js";

/* === ELEMENTOS === */
const adminsTable = document.getElementById("adminsTable");
const clientesTable = document.getElementById("clientesTable");

const addAdminModal = document.getElementById("addAdminModal");
const addAdminBtn = document.getElementById("addAdminBtn");
const cancelAddAdmin = document.getElementById("cancelAddAdmin");
const saveAdmin = document.getElementById("saveAdmin");

const editModal = document.getElementById("editModal");
const cancelEdit = document.getElementById("cancelEdit");
const saveEdit = document.getElementById("saveEdit");
let editId = null;

/* === CARGAR ADMINISTRADORES === */
async function loadAdmins() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id_usuario, usuario_nombre, usuario_apellido, usuario_email");

  if (error) {
    adminsTable.innerHTML = `<tr><td colspan="4">Error: ${error.message}</td></tr>`;
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
    </tr>
  `
    )
    .join("");
}

/* === CARGAR CLIENTES === */
async function loadClientes() {
  const { data, error } = await supabase
    .from("clientes")
    .select("id_clientes, cli_nombre, cli_apellido, cli_email, cli_celular");

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
      <td><button class="btn-edit" data-id="${c.id_clientes}">Editar</button></td>
    </tr>
  `
    )
    .join("");
}

/* === MODAL ADMIN === */
addAdminBtn.onclick = () => addAdminModal.classList.add("active");
cancelAddAdmin.onclick = () => addAdminModal.classList.remove("active");

saveAdmin.onclick = async () => {
  const nombre = document.getElementById("adminNombre").value.trim();
  const apellido = document.getElementById("adminApellido").value.trim();
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (!nombre || !apellido || !email || !password)
    return alert("Completa todos los campos.");

  const { error } = await supabase.from("usuarios").insert([
    {
      usuario_nombre: nombre,
      usuario_apellido: apellido,
      usuario_email: email,
      usuario_password: password,
      id_estado_fk: 1, // Activo
    },
  ]);

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("Administrador añadido correctamente.");
    addAdminModal.classList.remove("active");
    await loadAdmins();
  }
};

/* === MODAL EDIT CLIENTE === */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
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

  const { error } = await supabase
    .from("clientes")
    .update({
      cli_nombre: nombre,
      cli_apellido: apellido,
      cli_email: email,
      cli_celular: celular,
    })
    .eq("id_clientes", editId);

  if (error) alert("Error al actualizar: " + error.message);
  else {
    alert("Cliente actualizado correctamente.");
    editModal.classList.remove("active");
    await loadClientes();
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
loadAdmins();
loadClientes();
