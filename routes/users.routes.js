import {Router} from 'express';
const router = Router();
import { pool } from '../db.js';
import bcrypt from 'bcrypt';

// USUARIOS
// Obtener todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM personas');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Registrar nuevo usuario (cliente o empleado)
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, telefono, password, tipo_persona, departamentoid } = req.body;

    if (!nombre || !correo || !password || !tipo_persona) {
      return res.status(400).json({ error: 'Nombre, correo, rol y contraseña son obligatorios' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO personas (nombre, correo, telefono, password, tipo_persona) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, correo, telefono, hashedPassword, tipo_persona]
    );

    const nuevaPersona = result.rows[0];

    // Insertar en tabla específica según tipo_persona
    if (nuevaPersona.tipo_persona === 'cliente') {
      await pool.query(
        `INSERT INTO clientes (personaid, contacto)
         VALUES ($1, $2)`,
        [nuevaPersona.personaid, telefono]
      );
    } else if (nuevaPersona.tipo_persona === 'empleado') {
      if (!departamentoid) {
        return res.status(400).json({ error: "Falta el departamentoid para empleado" });
      }
      await pool.query(
        `INSERT INTO empleados (personaid, departamentoid)
         VALUES ($1, $2)`,
        [nuevaPersona.personaid, departamentoid]
      );
    }

    res.json({
      message: `Usuario registrado como ${nuevaPersona.tipo_persona} con éxito`,
      usuario: nuevaPersona,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: 'Correo y contraseña requeridos' });
    }

    // 🔍 Buscar usuario solo por el correo
    const result = await pool.query(
      'SELECT * FROM personas WHERE correo = $1',
      [correo]
    );

    // Si no existe ese correo
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const usuario = result.rows[0];

    // 🔐 Comparamos la contraseña en texto con el hash guardado
    const coincide = await bcrypt.compare(password, usuario.password);

    if (!coincide) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    res.json({ message: 'Login exitoso', usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// EMPLEADOS 
// Listar empleados con detalles
router.get('/empleados', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.empleadoid, p.nombre, d.nombredepartamento
      FROM empleados e
      JOIN personas p ON p.personaid = e.personaid
      JOIN departamentos d ON d.departamentoid = e.departamentoid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});
router.get('/ping', (req, res) => {
  res.send('Ruta activa');
});
// Crear empleado
router.post('/empleados', async (req, res) => {
  try {
    const { personaid, departamentoid } = req.body;

    // Validar campos obligatorios
    if (!personaid || !departamentoid) {
      return res.status(400).json({ error: 'Los campos personaid y departamentoid son obligatorios' });
    }

    // Insertar empleado
    const result = await pool.query(
      `INSERT INTO empleados (personaid, departamentoid)
       VALUES ($1, $2)
       RETURNING *`,
      [personaid, departamentoid]
    );

    res.status(201).json({
      message: 'Empleado creado exitosamente',
      empleado: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ error: 'Error en el servidor al crear empleado' });
  }
});

// Eliminar empleado
router.delete('/empleados/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM empleados WHERE empleadoid = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json({ message: 'Empleado eliminado correctamente', empleado: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ error: 'Error en el servidor al eliminar empleado' });
  }
});

// CLIENTES 
// Listar clientes con detalles
router.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.clienteid, p.nombre, c.contacto
      FROM clientes c
      JOIN personas p ON p.personaid = c.personaid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});
// Crear cliente
router.post('/clientes', async (req, res) => {
  try {
    const { personaid, contacto } = req.body;

    // Validar campos obligatorios
    if (!personaid || !contacto) {
      return res.status(400).json({ error: 'Los campos personaid y contacto son obligatorios' });
    }

    // Insertar cliente
    const result = await pool.query(
      `INSERT INTO clientes (personaid, contacto)
       VALUES ($1, $2)
       RETURNING *`,
      [personaid, contacto]
    );

    res.status(201).json({
      message: 'Cliente creado exitosamente',
      cliente: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error en el servidor al crear cliente' });
  }
});

// Eliminar cliente
router.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM clientes WHERE clienteid = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado correctamente', cliente: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error en el servidor al eliminar cliente' });
  }
});
// Obtener proyectos de un cliente específico
router.get('/clientes/:clienteId/proyectos', async (req, res) => {
  try {
    const { clienteId } = req.params;
    const result = await pool.query(
      `
      SELECT p.proyectoid, p.nombreproyecto, p.fechainicio, p.fechafin
      FROM proyectos p
      WHERE p.clienteid = $1
      `,
      [clienteId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener proyectos del cliente' });
  }
});

// PROYECTOS 
// Crear proyecto
router.post('/proyectos', async (req, res) => {
  try {
    const { nombreproyecto, fechainicio, fechafin, clienteid } = req.body;
    const result = await pool.query(
      `INSERT INTO proyectos (nombreproyecto, fechainicio, fechafin, clienteid)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombreproyecto, fechainicio, fechafin, clienteid]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Listar proyectos con cliente
router.get('/proyectos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.proyectoid, p.nombreproyecto, p.fechainicio, p.fechafin, c.clienteid, per.nombre AS cliente
      FROM proyectos p
      JOIN clientes c ON c.clienteid = p.clienteid
      JOIN personas per ON per.personaid = c.personaid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

router.delete('/proyectos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM proyectos WHERE proyectoid = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({
      message: 'Proyecto eliminado correctamente',
      proyectoEliminado: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el proyecto' });
  }
});

// RECURSOS 
// Crear recurso
router.post('/recursos', async (req, res) => {
  try {
    const { nombrerecurso, tiporecurso, cantidaddisponible, proyectoid, tipomaterial, cantidad, tipoequipo, estado } = req.body;
    
    const result = await pool.query(
      `INSERT INTO recursos (nombrerecurso, tiporecurso, cantidaddisponible, proyectoid)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombrerecurso, tiporecurso, cantidaddisponible, proyectoid]
    );

    const nuevoRecurso = result.rows[0];

    // Insertar en tabla específica según tiporecurso
    if (nuevoRecurso.tiporecurso === 'material') {
      await pool.query(
        `INSERT INTO materiales (recursoid, tipomaterial, cantidad)
         VALUES ($1, $2, $3)`,
        [nuevoRecurso.recursoid, tipomaterial, cantidad]
      );
    } else if (nuevoRecurso.tiporecurso === 'equipo') {
      await pool.query(
        `INSERT INTO equipos (recursoid, tipoequipo, estado)
         VALUES ($1, $2, $3)`,
        [nuevoRecurso.recursoid, tipoequipo, estado]
      );
    }

    res.json({
      message: `Recurso registrado como ${nuevoRecurso.tiporecurso} con éxito`,
      recurso: nuevoRecurso,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Listar todos los recursos
router.get('/recursos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.recursoid, r.nombrerecurso, r.tiporecurso, r.cantidaddisponible, 
             p.nombreproyecto, r.proyectoid
      FROM recursos r
      LEFT JOIN proyectos p ON p.proyectoid = r.proyectoid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recursos' });
  }
});

// Listar materiales
router.get('/materiales', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.materialid, r.nombrerecurso, m.tipomaterial, m.cantidad
      FROM materiales m
      JOIN recursos r ON r.recursoid = m.recursoid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materiales' });
  }
});

// Listar equipos
router.get('/equipos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.equipoid, r.nombrerecurso, e.tipoequipo, e.estado
      FROM equipos e
      JOIN recursos r ON r.recursoid = e.recursoid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
});
router.delete('/recursos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el recurso existe
    const existe = await pool.query(
      'SELECT * FROM recursos WHERE recursoid = $1',
      [id]
    );

    if (existe.rows.length === 0) {
      return res.status(404).json({ message: "Recurso no encontrado" });
    }

    // Borrar material asociado si existe
    await pool.query(
      'DELETE FROM materiales WHERE recursoid = $1',
      [id]
    );

    // Borrar equipo asociado si existe
    await pool.query(
      'DELETE FROM equipos WHERE recursoid = $1',
      [id]
    );

    // Borrar el recurso
    await pool.query(
      'DELETE FROM recursos WHERE recursoid = $1',
      [id]
    );

    return res.json({ message: "Recurso eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar recurso:", error);
    res.status(500).json({ error: "Error al eliminar recurso" });
  }
});


// ============ TAREAS ============
// Crear tarea
router.post('/tareas', async (req, res) => {
  try {
    const { nombretarea, fechainicio, fechafin, proyectoid, impacto, riesgo, beneficio, tipotarea } = req.body;

    const result = await pool.query(
      `INSERT INTO tareas (nombretarea, fechainicio, fechafin, proyectoid, tipotarea)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombretarea, fechainicio, fechafin, proyectoid, tipotarea]
    );

    const nuevaTarea = result.rows[0];

    // Insertar en tabla específica según tipotarea
    if (nuevaTarea.tipotarea === 'tareascriticas') {
      await pool.query(
        `INSERT INTO tareascriticas (tareaid, impacto, riesgo)
         VALUES ($1, $2, $3)`,
        [nuevaTarea.tareaid, impacto, riesgo]
      );
    } else if (nuevaTarea.tipotarea === 'tareasopcionales') {
      await pool.query(
        `INSERT INTO tareasopcionales (tareaid, beneficio)
         VALUES ($1, $2)`,
        [nuevaTarea.tareaid, beneficio]
      );
    }

    res.json({
      message: `Tarea registrada como ${nuevaTarea.tipotarea} con éxito`,
      tarea: nuevaTarea,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Listar todas las tareas
router.get('/tareas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.tareaid, t.nombretarea, t.fechainicio, t.fechafin, 
             t.tipotarea, p.nombreproyecto
      FROM tareas t
      JOIN proyectos p ON p.proyectoid = t.proyectoid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Listar tareas críticas
router.get('/tareas/criticas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tc.criticaid, t.nombretarea, tc.impacto, tc.riesgo
      FROM tareascriticas tc
      JOIN tareas t ON t.tareaid = tc.tareaid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas críticas' });
  }
});

// Listar tareas opcionales
router.get('/tareas/opcionales', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT to.opcionalid, t.nombretarea, to.beneficio
      FROM tareasopcionales to
      JOIN tareas t ON t.tareaid = to.tareaid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas opcionales' });
  }
});
router.delete('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tareas WHERE tareaid = $1', [id]);
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});


// ============ ASIGNACIONES ============
// Crear asignación
router.post('/asignaciones', async (req, res) => {
  try {
    const { empleadoid, tareaid, horasasignadas, fechaasignacion } = req.body;
    const result = await pool.query(
      `INSERT INTO asignaciones (empleadoid, tareaid, horasasignadas, fechaasignacion)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [empleadoid, tareaid, horasasignadas, fechaasignacion]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Listar todas las asignaciones
router.get('/asignaciones', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.asignacionid, p.nombre AS empleado, t.nombretarea, 
             a.horasasignadas, a.fechaasignacion
      FROM asignaciones a
      JOIN empleados e ON e.empleadoid = a.empleadoid
      JOIN personas p ON p.personaid = e.personaid
      JOIN tareas t ON t.tareaid = a.tareaid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener asignaciones' });
  }
});
// Eliminar una asignación
router.delete('/asignaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM asignaciones WHERE asignacionid = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }

    res.json({ message: 'Asignación eliminada correctamente', asignacion: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar asignación:', error);
    res.status(500).json({ error: 'Error al eliminar asignación' });
  }
});

// ============ REPORTES ============
// Crear reporte
router.post('/reportes', async (req, res) => {
  try {
    const { proyecto_id, descripcion } = req.body;
    const result = await pool.query(
      `INSERT INTO reportes (proyectoid, fechageneracion, descripcion)
       VALUES ($1, NOW(), $2) RETURNING *`,
      [proyecto_id, descripcion]
    );
    res.json({ message: 'Reporte generado', reporte: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el reporte' });
  }
});

// Listar todos los reportes
router.get('/reportes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.reporteid, r.fechageneracion, r.descripcion, p.nombreproyecto
      FROM reportes r
      JOIN proyectos p ON p.proyectoid = r.proyectoid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

// Obtener reportes por proyecto
router.get('/reportes/proyecto/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reportes WHERE proyectoid = $1', [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes del proyecto' });
  }
});

// Eliminar reporte por ID
router.delete('/reportes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Ejecutar eliminación
    const result = await pool.query(
      'DELETE FROM reportes WHERE reporteid = $1 RETURNING *',
      [id]
    );

    // Si no existe
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Reporte no encontrado',
      });
    }

    res.json({
      message: 'Reporte eliminado correctamente',
      reporte: result.rows[0],
    });
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    res.status(500).json({ error: 'Error al eliminar el reporte' });
  }
});


// ============ DEPARTAMENTOS ============
// Crear departamento
router.post('/departamentos', async (req, res) => {
  try {
    const { nombredepartamento, jefe_departamento } = req.body;
    const result = await pool.query(
      `INSERT INTO departamentos (nombredepartamento, jefedepartamento)
       VALUES ($1, $2) RETURNING *`,
      [nombredepartamento, jefe_departamento]
    );
    res.json({ message: 'Departamento creado', departamento: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el departamento' });
  }
});

// Listar departamentos
router.get('/departamentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departamentos');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener departamentos' });
  }
});
// Eliminar departamento por ID
router.delete('/departamentos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el departamento existe antes de eliminarlo
    const check = await pool.query('SELECT * FROM departamentos WHERE departamentoid = $1', [id]);

    if (check.rowCount === 0) {
      return res.status(404).json({ error: 'Departamento no encontrado' });
    }

    // Eliminar el departamento
    await pool.query('DELETE FROM departamentos WHERE departamentoid = $1', [id]);

    res.json({ message: 'Departamento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar departamento:', error);
    res.status(500).json({ error: 'Error interno al eliminar el departamento' });
  }
});


// ============ PRESUPUESTOS ============
// Crear presupuesto (solo uno por proyecto)
router.post("/presupuestos", async (req, res) => {
  try {
    const { monto, proyectoid } = req.body;

    if (!monto || !proyectoid) {
      return res
        .status(400)
        .json({ error: "Monto y ProyectoID son obligatorios" });
    }

        // Nueva validación según la restricción actualizada
    if (monto < 1000) {
      return res.status(400).json({
        error: "El monto debe ser mayor o igual a 1000",
      });
    }

    // Insertar presupuesto (la BD maneja la restricción UNIQUE del proyectoid)
    const result = await pool.query(
      `INSERT INTO presupuestos (monto, proyectoid)
       VALUES ($1, $2)
       RETURNING presupuestoid, monto, proyectoid`,
      [monto, proyectoid]
    );

    res.json({
      message: "Presupuesto creado exitosamente",
      presupuesto: result.rows[0],
    });
} catch (error) {
  console.error("Error al crear presupuesto:", error);

  const pgError = error?.code || error?.constraint || error?.detail || "";

  // Detectar UNIQUE constraint aunque PG devuelva diferente formato
  if (
    pgError.includes("unique") ||
    pgError.includes("23505") ||
    pgError.includes("presupuestos_proyectoid_key")
  ) {
    return res.status(400).json({
      error: "Este proyecto ya tiene un presupuesto asignado",
    });
  }

  return res.status(500).json({
    error: "Error interno del servidor",
  });
}

});

/**
 * 📋 Listar todos los presupuestos
 */
router.get("/presupuestos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pr.presupuestoid, pr.monto, p.nombreproyecto, pr.proyectoid
      FROM presupuestos pr
      JOIN proyectos p ON p.proyectoid = pr.proyectoid
      ORDER BY pr.presupuestoid ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener presupuestos:", error);
    res.status(500).json({ error: "Error al obtener presupuestos" });
  }
});

/**
 * 🔍 Obtener presupuesto por ID
 */
router.get("/presupuestos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM presupuestos WHERE presupuestoid = $1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Presupuesto no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener presupuesto:", error);
    res.status(500).json({ error: "Error al obtener presupuesto" });
  }
});

/**
 * 🔍 Obtener presupuesto por proyecto
 */
router.get("/proyecto/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT pr.presupuestoid, pr.monto, p.nombreproyecto, pr.proyectoid
       FROM presupuestos pr
       JOIN proyectos p ON p.proyectoid = pr.proyectoid
       WHERE pr.proyectoid = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ error: "El proyecto no tiene presupuesto asignado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener presupuesto del proyecto:", error);
    res
      .status(500)
      .json({ error: "Error al obtener presupuesto del proyecto" });
  }
});

// ============ GASTOS ============
// Registrar gasto
router.post('/gastos', async (req, res) => {
  try {
    const { monto, fecha, proyectoid } = req.body;

    if (!monto || !fecha || !proyectoid) {
      return res.status(400).json({ error: 'Monto, fecha y proyecto son obligatorios' });
    }

    const result = await pool.query(
      `INSERT INTO gastos (monto, fecha, proyectoid)
       VALUES ($1, $2, $3) RETURNING *`,
      [monto, fecha, proyectoid]
    );

    res.json({ message: 'Gasto registrado', gasto: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar gasto' });
  }
});

// Listar todos los gastos
router.get('/gastos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.gastoid, g.monto, g.fecha, p.nombreproyecto
      FROM gastos g
      JOIN proyectos p ON p.proyectoid = g.proyectoid
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener gastos' });
  }
});

// Listar gastos por proyecto
router.get('/gastos/proyecto/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gastos WHERE proyectoid = $1', [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener gastos del proyecto' });
  }
});
// Eliminar gasto por ID
router.delete('/gastos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM gastos WHERE gastoid = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    res.json({
      message: 'Gasto eliminado correctamente',
      gasto: result.rows[0],
    });
  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    res.status(500).json({ error: 'Error al eliminar gasto' });
  }
});


export default router;