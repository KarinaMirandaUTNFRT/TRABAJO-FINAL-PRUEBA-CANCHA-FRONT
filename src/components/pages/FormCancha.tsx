import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type { Cancha, CanchaFormData } from "../../interfaces/canchas";
import Swal from "sweetalert2";
import {
  crearCanchaApi,
  listarCategoriasApi,
  editarCanchaApi,
  buscarCanchaApi,
} from "../../helpers/queries";
import { useEffect, useState } from "react";

interface FormularioCanchaProps {
  titulo: string;
}

const FormCancha = ({ titulo }: FormularioCanchaProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CanchaFormData>();

  const { id } = useParams<{ id: string }>();
  const navegacion = useNavigate();
  const [categorias, setCategorias] = useState<Cancha[]>([]);
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const respuesta = await listarCategoriasApi();
        if (Array.isArray(respuesta)) {
          setCategorias(respuesta);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    obtenerCategorias();
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    if (titulo.includes("Editar cancha") && id && buscarCanchaApi) {
      try {
        const respuestaCancha = await buscarCanchaApi(id);

        if (respuestaCancha.ok) {
          const jsonRespuesta = await respuestaCancha.json();

          const canchaBuscada = jsonRespuesta.cancha || jsonRespuesta;
          setValue("nombreCancha", canchaBuscada.nombreCancha);
          setValue("precio", canchaBuscada.precio);
          const categoriaId =
            canchaBuscada.categoria?._id ?? canchaBuscada.categoria;
          setValue("categoria", categoriaId);
          setValue("descripcion", canchaBuscada.descripcion);
          setValue("imagen", canchaBuscada.imagen);
        } else {
          console.error(
            "Error en la respuesta de la API. Status:",
            respuestaCancha.status,
          );
        }
      } catch (error) {
        console.error("Error de red o al procesar la petición:", error);
      }
    } else {
    }
  };

  const onSubmit: SubmitHandler<CanchaFormData> = async (data, e) => {
    if (titulo.includes("Crear") && crearCanchaApi) {
      await crearCanchaApi(data);
      Swal.fire({
        title: "La Cancha ha sido creada",
        text: `La cancha '${data.nombreCancha}' fue creada correctamente`,
        icon: "success",
        background: "#18181b",
        color: "#f4f4f5",
        confirmButtonColor: "#3b82f6",
      });
      navegacion("/administrador/");
      if (e) {
        (e.target as HTMLFormElement).reset();
      }
    } else if (id) {
      const respuesta = await editarCanchaApi(id, data);

      if (respuesta.ok) {
        Swal.fire({
          title: "Cancha Editada",
          text: `La cancha '${data.nombreCancha}' fue editada correctamente`,
          icon: "success",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
        navegacion("/administrador/");
      } else {
        Swal.fire({
          title: "Ocurrió un Error",
          text: `La cancha'${data.nombreCancha}' no pudo ser editada.`,
          icon: "error",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
      }
    }
  };

  const inputClass = (hasError: boolean) => `
    w-full px-4 py-2.5 bg-zinc-950 border rounded-lg text-zinc-100 
    focus:outline-none focus:ring focus:ring-green-400 transition-all
    ${hasError ? "border-red-500" : "border-zinc-700"}
  `;

  return (
    <section className="max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-slate-700 p-8 rounded-2xl border border-slate-900 shadow-xl my-3">
        <h1 className="text-3xl text-right font-bold text-white mb-8 border-b border-slate-500 pb-4">
          {titulo}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-500 mb-2">
                Nombre Cancha*
              </label>
              <input
                type="text"
                placeholder="Ej: Cancha techada 1"
                className={inputClass(!!errors.nombreCancha)}
                {...register("nombreCancha", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.nombreCancha?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">
                Precio*
              </label>
              <input
                type="number"
                placeholder="Ej: 50000"
                className={inputClass(!!errors.precio)}
                {...register("precio", {
                  required: "El precio es obligatorio",
                  min: { value: 50, message: "Mínimo $50" },
                  valueAsNumber: true,
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.precio?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tipo Cancha*
              </label>
              <select
                className={inputClass(!!errors.categoria)}
                {...register("categoria", {
                  required: "Seleccione una categoría",
                })}
              >
                <option value="" className="bg-zinc-900">
                  Seleccione una opción
                </option>
                {categorias.map((categoria: any) => (
                  <option
                    key={categoria._id}
                    value={categoria._id}
                    className="bg-zinc-900"
                  >
                    {categoria.descripcion}
                  </option>
                ))}
              </select>
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.categoria?.message as string}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-500 mb-2">
                URL de Imagen*
              </label>
              <input
                type="text"
                placeholder="https://ejemplo.com/imagen.jpg"
                className={inputClass(!!errors.imagen)}
                {...register("imagen", {
                  required: "La URL es obligatoria",
                  pattern: {
                    value: /\.(jpg|jpeg|png|webp|avif|svg)$/,
                    message:
                      "Debe ser una URL de imagen válida (jpg, png, webp, etc.)",
                  },
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.imagen?.message}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-500 mb-2">
                Descripción*
              </label>
              <textarea
                rows={4}
                placeholder="Describa la cancha detalladamente..."
                className={inputClass(!!errors.descripcion)}
                {...register("descripcion", {
                  required: "La descripción es obligatoria",
                  minLength: { value: 10, message: "Mínimo 10 caracteres" },
                  maxLength: { value: 500, message: "Máximo 500 caracteres" },
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.descripcion?.message}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20"
            >
              {titulo.includes("Editar") ? "Guardar Cambios" : "Crear Cancha"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FormCancha;
