import { useForm, type SubmitHandler } from "react-hook-form";
import type { Producto, ProductoFormData } from "../../interfaces/productos";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  buscarProductoApi,
  crearProductoApi,
  editarProductoApi,
  listarCategoriasProductosApi,
} from "../../helpers/queries";

interface FormularioProps {
  titulo: string;
}

const Formulario = ({ titulo }: FormularioProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductoFormData>();

  const { id } = useParams<{ id: string }>();
  const navegacion = useNavigate();
  const [categorias, setCategorias] = useState<Producto[]>([]);

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const respuesta = await listarCategoriasProductosApi();
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
    if (titulo.includes("Editar") && id && buscarProductoApi) {
      const respuestaProducto = await buscarProductoApi(id);
      if (respuestaProducto && respuestaProducto.status === 200) {
        const productoBuscado = await respuestaProducto.json();

        setValue("nombreProducto", productoBuscado.nombreProducto);
        setValue("precio", productoBuscado.precio);
        const categoriaId =
          productoBuscado.categoria?._id ?? productoBuscado.categoria;
        setValue("categoria", categoriaId);
        setValue("descripcion", productoBuscado.descripcion);
        setValue("imagen", productoBuscado.imagen);
      }
    }
  };

  const onSubmit: SubmitHandler<ProductoFormData> = async (data, e) => {
    if (titulo.includes("Crear") && crearProductoApi) {
      await crearProductoApi(data);
      Swal.fire({
        title: "Producto creado",
        text: `El producto '${data.nombreProducto}' fue creado correctamente`,
        icon: "success",
        background: "#18181b",
        color: "#f4f4f5",
        confirmButtonColor: "#3b82f6",
      });
      if (e) {
        (e.target as HTMLFormElement).reset();
      }
    } else if (id) {
      const respuesta = await editarProductoApi(id, data);

      if (respuesta.ok) {
        Swal.fire({
          title: "Producto editado",
          text: `El producto '${data.nombreProducto}' fue editado correctamente`,
          icon: "success",
          background: "#18181b",
          color: "#f4f4f5",
          confirmButtonColor: "#3b82f6",
        });
        navegacion("/administrador/productos");
      } else {
        Swal.fire({
          title: "Ocurrió un Error",
          text: `El producto '${data.nombreProducto}' no pudo ser editado.`,
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
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-900 shadow-xl my-3">
        <h1 className="text-3xl text-right font-bold text-white mb-8 border-b border-slate-500 pb-4">
          {titulo}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-500 mb-2">
                Nombre del Producto*
              </label>
              <input
                type="text"
                placeholder="Guantes arquero"
                className={inputClass(!!errors.nombreProducto)}
                {...register("nombreProducto", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                })}
              />
              <p className="text-red-500 text-xs mt-1 italic">
                {errors.nombreProducto?.message}
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
              <label className="block text-sm font-medium text-slate-500 mb-2">
                Categoría*
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
                {categorias.map((categoria) => (
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
                {errors.categoria?.message}
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
                placeholder="Describa el Producto detalladamente..."
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
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Formulario;
