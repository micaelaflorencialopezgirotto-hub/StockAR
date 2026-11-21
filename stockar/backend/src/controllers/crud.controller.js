// Fábrica de controladores CRUD con validaciones comunes.
// Todas las respuestas siguen el formato { status, data }.

export class ValidationError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

export function getBody(req) {
  const body = req.body ?? {};
  if (typeof body !== 'object' || Array.isArray(body)) {
    throw new ValidationError(400, 'El cuerpo de la solicitud debe ser un objeto JSON');
  }
  return body;
}

export function handleError(res, error) {
  if (error instanceof ValidationError) {
    return res.status(error.status).json({ status: error.status, data: { message: error.message } });
  }
  console.error(error);
  return res.status(500).json({ status: 500, data: { message: 'Error interno del servidor' } });
}

function notFound(res, message) {
  return res.status(404).json({ status: 404, data: { message } });
}

/**
 * Impide borrar un registro que otros todavía referencian.
 * @param id      id del registro que se quiere borrar
 * @param usedBy  [{ model, field, label: [singular, plural] }] — entidades que guardan este id en `field`
 */
export async function assertNotInUse(id, usedBy = []) {
  const usos = [];
  for (const { model, field, label: [singular, plural] } of usedBy) {
    const cantidad = (await model.getAll()).filter((item) => item[field] === id).length;
    if (cantidad) usos.push(`${cantidad} ${cantidad === 1 ? singular : plural}`);
  }
  if (usos.length) {
    throw new ValidationError(409, `No se puede eliminar: está en uso por ${usos.join(', ')}`);
  }
}

/**
 * @param model  modelo creado con createModel
 * @param options.notFoundMessage  mensaje para el 404
 * @param options.required    campos obligatorios
 * @param options.enums       { campo: [valores permitidos] }
 * @param options.references  { campo: modeloReferenciado } — valida que el id exista
 * @param options.unique      [[campo], [campoA, campoB]] — combinaciones únicas
 * @param options.validate    (merged, current) => mensaje de error | null
 * @param options.usedBy      [{ model, field, label: [singular, plural] }] — bloquea el DELETE (409) si hay registros que lo usan
 */
export function createController(model, options) {
  const {
    notFoundMessage = 'Registro no encontrado',
    required = [],
    enums = {},
    references = {},
    unique = [],
    validate,
    usedBy = [],
  } = options;

  // current = null en el alta; el registro existente en una edición
  async function check(data, current = null) {
    const missing = required.filter((field) =>
      current ? Object.hasOwn(data, field) && isEmpty(data[field]) : isEmpty(data[field]),
    );
    if (missing.length) {
      throw new ValidationError(400, `Faltan campos obligatorios: ${missing.join(', ')}`);
    }

    for (const [field, values] of Object.entries(enums)) {
      if (!isEmpty(data[field]) && !values.includes(data[field])) {
        throw new ValidationError(400, `El campo ${field} debe ser uno de: ${values.join(', ')}`);
      }
    }

    for (const [field, refModel] of Object.entries(references)) {
      if (!isEmpty(data[field]) && !(await refModel.getById(data[field]))) {
        throw new ValidationError(400, `No existe el registro '${data[field]}' indicado en ${field}`);
      }
    }

    const merged = { ...current, ...data };

    for (const fields of unique) {
      if (fields.some((field) => isEmpty(merged[field]))) continue;
      const duplicado = await model.findOne(
        (item) => item.id !== current?.id && fields.every((field) => item[field] === merged[field]),
      );
      if (duplicado) {
        throw new ValidationError(409, `Ya existe un registro con el mismo ${fields.join(' + ')}`);
      }
    }

    if (validate) {
      const message = await validate(merged, current);
      if (message) throw new ValidationError(400, message);
    }
  }

  async function getAll(req, res) {
    try {
      const data = await model.getAll(req.query);
      return res.status(200).json({ status: 200, data });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async function getById(req, res) {
    try {
      const data = await model.getById(req.params.id);
      if (!data) return notFound(res, notFoundMessage);
      return res.status(200).json({ status: 200, data });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async function create(req, res) {
    try {
      const body = getBody(req);
      await check(body);
      const data = await model.create(body);
      return res.status(201).json({ status: 201, data });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async function update(req, res) {
    try {
      const current = await model.getById(req.params.id);
      if (!current) return notFound(res, notFoundMessage);
      const body = getBody(req);
      await check(body, current);
      const data = await model.update(req.params.id, body);
      return res.status(200).json({ status: 200, data });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async function remove(req, res) {
    try {
      if (!(await model.getById(req.params.id))) return notFound(res, notFoundMessage);
      await assertNotInUse(req.params.id, usedBy);
      const data = await model.remove(req.params.id);
      if (!data) return notFound(res, notFoundMessage);
      return res.status(200).json({ status: 200, data });
    } catch (error) {
      return handleError(res, error);
    }
  }

  return { getAll, getById, create, update, remove, check };
}

export default createController;
