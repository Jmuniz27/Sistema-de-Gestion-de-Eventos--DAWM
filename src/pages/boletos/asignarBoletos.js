// Enviar información a Supabase
import supabase from '../../../lib/supabase.js';

export default async function enviarABaseDeDatos(datos, usuario) {
    try {
        // Usar usuario logueado o usuario genérico del sistema (ID 13)
        const idUsuario = usuario?.id_usuario || 13;
        
        console.log('📤 Enviando datos a Supabase:', datos);
        console.log('👤 ID Usuario usado:', idUsuario);

        // PASO 1: Obtener IDs necesarios dinámicamente
        
        // Obtener id_tipocliente_fk para "Persona Natural"
        const { data: tipoCliente } = await supabase
            .from('tipocliente')
            .select('id_tipocliente')
            .eq('tipcli_nombre', 'Persona Natural')
            .single();
        
        if (!tipoCliente) throw new Error('No se encontró tipo de cliente "Persona Natural"');

        // Obtener id_tipodocumento_fk para "Cédula"
        const { data: tipoDoc } = await supabase
            .from('tipodocumento')
            .select('id_tipodocumento')
            .eq('tipdoc_nombre', 'Cédula')
            .single();
        
        if (!tipoDoc) throw new Error('No se encontró tipo de documento "Cédula"');

        // Obtener primer proveedor activo
        const { data: proveedor } = await supabase
            .from('proveedores')
            .select('id_proveedores')
            .eq('prov_estado', 'Activo')
            .limit(1)
            .single();
        
        if (!proveedor) throw new Error('No hay proveedores activos');

        // Obtener estado "Vendido" para boletos
        const { data: estadoBoleto } = await supabase
            .from('estadoboleto')
            .select('id_estadoboleto')
            .ilike('estb_nombre', '%vendido%')
            .single();
        
        let idEstadoBoleto = 1; // Valor por defecto
        
        if (estadoBoleto) {
            idEstadoBoleto = estadoBoleto.id_estadoboleto;
        } else {
            // Si no existe "Vendido", tomar el primer estado disponible
            const { data: primerEstado } = await supabase
                .from('estadoboleto')
                .select('id_estadoboleto')
                .limit(1)
                .single();
            
            if (primerEstado) {
                idEstadoBoleto = primerEstado.id_estadoboleto;
            }
        }

        // Obtener primer tipo de boleto disponible
        const { data: tipoBoleto } = await supabase
            .from('tiposboleto')
            .select('id_tiposboleto')
            .limit(1)
            .single();
        
        if (!tipoBoleto) throw new Error('No hay tipos de boleto configurados');

        console.log('✅ IDs obtenidos:', {
            tipoCliente: tipoCliente.id_tipocliente,
            tipoDoc: tipoDoc.id_tipodocumento,
            proveedor: proveedor.id_proveedores,
            estadoBoleto: idEstadoBoleto,
            tipoBoleto: tipoBoleto.id_tiposboleto
        });

        // PASO 2: Crear o buscar cliente
        const { data: clienteExistente } = await supabase
            .from('clientes')
            .select('id_clientes')
            .eq('cli_identificacion', datos.cliente.cedula)
            .single();

        let idCliente;

        if (clienteExistente) {
            idCliente = clienteExistente.id_clientes;
            console.log('✅ Cliente ya existe:', idCliente);
        } else {
            // Separar nombre y apellido
            const nombreCompleto = datos.cliente.nombre.trim().split(' ');
            const nombre = nombreCompleto[0];
            const apellido = nombreCompleto.slice(1).join(' ') || 'N/A';

            const { data: nuevoCliente, error: clienteError } = await supabase
                .from('clientes')
                .insert([{
                    id_tipocliente_fk: tipoCliente.id_tipocliente,
                    id_tipodocumento_fk: tipoDoc.id_tipodocumento,
                    cli_nombre: nombre,
                    cli_apellido: apellido,
                    cli_identificacion: datos.cliente.cedula,
                    cli_email: datos.cliente.correo,
                    cli_celular: datos.cliente.telefono
                }])
                .select('id_clientes')
                .single();

            if (clienteError) throw new Error(`Error al crear cliente: ${clienteError.message}`);
            
            idCliente = nuevoCliente.id_clientes;
            console.log('✅ Cliente creado:', idCliente);
        }

        // PASO 3: Crear boleto
        const precioUnitario = datos.seleccion.precioTotal / datos.seleccion.cantidad;
        const seccion = parseInt(datos.seleccion.seccion);

        const { data: nuevoBoleto, error: boletoError } = await supabase
            .from('boleto')
            .insert([{
                id_evento_fk: datos.evento.id_eventos,
                id_tipoboleto_fk: tipoBoleto.id_tiposboleto,
                id_estadoboleto_fk: idEstadoBoleto,
                id_proveedor_fk: proveedor.id_proveedores,
                bol_precio: precioUnitario,
                bol_seccion: isNaN(seccion) ? null : seccion
            }])
            .select('id_boleto')
            .single();

        if (boletoError) throw new Error(`Error al crear boleto: ${boletoError.message}`);
        console.log('✅ Boleto creado:', nuevoBoleto.id_boleto);

        // PASO 4: Asignar entrada al usuario/cliente
        const fechaValida = new Date();
        fechaValida.setDate(fechaValida.getDate() + 365); // Válido por 1 año

        const { data: entradaAsignada, error: entradaError } = await supabase
            .from('entradasasignadas')
            .insert([{
                id_boleto_fk: nuevoBoleto.id_boleto,
                id_cliente_fk: idCliente,
                id_usuario_fk: idUsuario,
                enta_cantidad: datos.seleccion.cantidad,
                enta_fechavalida: fechaValida.toISOString()
            }])
            .select();

        if (entradaError) throw new Error(`Error al asignar entrada: ${entradaError.message}`);
        console.log('✅ Entrada asignada:', entradaAsignada);

        return { 
            exito: true, 
            mensaje: '✅ Boletos asignados correctamente a ' + datos.cliente.nombre,
            data: { 
                idCliente, 
                idBoleto: nuevoBoleto.id_boleto, 
                cantidad: datos.seleccion.cantidad 
            }
        };

    } catch (err) {
        console.error('❌ Error completo:', err);
        return { 
            exito: false, 
            mensaje: `❌ Error al guardar: ${err.message}` 
        };
    }
}

