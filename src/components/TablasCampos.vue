<template>
  <v-layout align-start>
    <v-flex>
      <div class="row" v-if="errors.length>0">
        <div class="col-12">
          <v-layout row>
            <v-flex>
              <v-alert
                style="margin-bottom:50px"
                error
                v-if="errors.length > 0"
                value="true"
                transition="scale-transition"
              >
                <ul v-for="error in errors" v-bind:key="error.id">
                  <li>{{error}}</li>
                </ul>
              </v-alert>
            </v-flex>
          </v-layout>
        </div>
      </div>

      <v-toolbar flat color="white">
        <v-toolbar-title>Tablas Campos</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-layout>
          <v-text-field
            v-if="verNuevo==0"
            class="text-xs-center"
            v-model="search"
            append-icon="search"
            label="Búsqueda"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-select
            v-if="verNuevo==0"
            label="Aspecto"
            v-bind:items="plantillas"
            item-text="nombre"
            autocomplete
            no-data-text="No hay datos con esta descripción"
            item-value="id"
            persistent-hint
            single-line
            @change="listarByPlantilla"
            bottom
          ></v-select>
          <v-spacer></v-spacer>
          <v-select
            v-if="verNuevo==0"
            label="Nombre Categoria"
            v-bind:items="categoriasbyPlantilla"
            item-text="nombre"
            autocomplete
            no-data-text="No hay datos con esta descripción"
            item-value="id"
            persistent-hint
            single-line
            @change="listarByCategoria"
            bottom
          ></v-select>
          <v-spacer></v-spacer>
          <v-select
            v-if="verNuevo==0"
            label="Campos"
            v-bind:items="camposbyCategoria"
            item-text="nombre"
            autocomplete
            no-data-text="No hay datos con esta descripción"
            item-value="id"
            persistent-hint
            single-line
            @change="listarByCampo"
            bottom
          ></v-select>
          <v-btn color="primary" v-if="verNuevo==0" @click="listar()" dark class="mb-2">Todos</v-btn>

          <v-btn color="primary" v-if="verNuevo==0" @click="mostrarNuevo()" dark class="mb-2">Nuevo</v-btn>
        </v-layout>

        <!--Dialog para eliminar un campo-->
        <v-dialog v-model="dialogEliminar" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Eliminar Campo</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md12>
                    <v-card-text>
                      ¿Estas seguro que deseas eliminar el
                      Campo?
                    </v-card-text>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12 class="red--text" v-if="errorM">{{ errorM }}</v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="closeEliminar">Cancelar</v-btn>
              <v-btn color="blue darken-1" flat @click="eliminar">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--Fin Dialog-->
      </v-toolbar>
      <!--DataTable para mostrar todos los campos-->
      <v-data-table
        v-if="verNuevo==0"
        :headers="headers"
        :items="campos"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.orden }}</td>
          <td>{{ props.item.visible }}</td>
          <td>{{ props.item.tipo }}</td>
          <td>{{ props.item.unidad }}</td>
          <td>{{ props.item.id_campo }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon small class="mr-2" @click="eliminarItem(props.item)">delete</v-icon>
          </td>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Resetear</v-btn>
        </template>
      </v-data-table>
      <!--Container para nuevo ingreso de campo-->

      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm6 md6 lg6 xl4>
            <v-select
              v-if="verPlantillasAspectos"
              label="Aspecto"
              v-bind:items="plantillas"
              item-text="nombre"
              autocomplete
              no-data-text="No hay datos con esta descripción"
              item-value="id"
              persistent-hint
              single-line
              @change="listarByPlantilla"
              bottom
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl4>
            <v-select
              v-if="verPlantillasAspectos"
              label="Nombre Categoria"
              v-bind:items="categoriasbyPlantilla"
              item-text="nombre"
              autocomplete
              no-data-text="No hay datos con esta descripción"
              item-value="id"
              persistent-hint
              single-line
              @change="listarByCategoria"
              bottom
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl4>
            <v-select
              v-if="verPlantillasAspectos"
              label="Campos"
              v-bind:items="camposbyCategoria"
              item-text="nombre"
              autocomplete
              no-data-text="No hay datos con esta descripción"
              item-value="id"
              persistent-hint
              single-line
              @change="listarByCampo"
              bottom
            ></v-select>
          </v-flex>

          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="nombre" label="Nombre"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="valor_maximo" label="Valor Maximo"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="valor_minimo" label="Valor Minimo"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="valor_defecto" label="Valor Defecto"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="rangos" label="Rangos"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="orden" label="Orden"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="tipo" label="Tipo"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="unidad" label="Unidad"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="enableFields" label="Habilitar Campos"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="disableFields" label="Deshabilitar Campos"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="id_selector" label="Selector"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="id_validacion" label="Validación"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <label>Visible {{tipoVisible}}</label>
            <v-select
              v-bind:items="['SI', 'NO']"
              autocomplete
              no-data-text="No hay datos con esta descripción"
              item-value="visible"
              persistent-hint
              single-line
              @change="changeVisible"
              bottom
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <label>Deshabilitado {{tipoDisabled}}</label>
            <v-select
              v-bind:items="['SI', 'NO']"
              autocomplete
              no-data-text="No hay datos con esta descripción"
              item-value="disabled"
              persistent-hint
              single-line
              @change="changeDisabled"
              bottom
            ></v-select>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2 v-show="errorM">
            <div class="red--text" v-text="errorM"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12></v-flex>
          <v-flex xs12 sm12 md12 v-show="valida">
            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click.native="guardado()">Guardar</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      dialog: false,
      dialogEliminar: false,
      dialogErrores: false,
      search: "",
      _id: "",
      _id_plantilla: "",
      _id_categoria: "",
      nombre: "",
      _id_campo: "",
      valor_maximo: 0,
      valor_minimo: 0,
      valor_defecto: 0,
      rangos: 0,
      orden: "",
      visible: "",
      tipo: "",
      unidad: "",
      disabled: "",
      enableFields: "",
      disableFields: "",
      tipoRequired: "",
      tipoVisible: "",
      tipoDisabled: "",
      id_selector: "",
      id_validacion: "",
      plantillaSeleccionada: 0,
      categoriaSeleccionada: 0,
      errors: [],
      Aspectos: [],
      valida: 0,
      validaMensaje: [],
      campos: [],
      categoriasbyPlantilla: [],
      camposbyCategoria: [],
      plantillas: [],
      verPlantillasAspectos: 0,
      errorM: null,
      verNuevo: 0,
      buscarPlantilla: 0,
      //Headers para el data table que muestra todas las campos
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Nombre", value: "nombre", sortable: false },
        { text: "Orden", value: "orden", sortable: true },
        { text: "Visible", value: "visible", sortable: false },
        { text: "Tipo", value: "tipo", sortable: false },
        { text: "Unidad", value: "unidad", sortable: false },
        { text: "Id Campo", value: "id_campo", sortable: false }
      ],
      deleteItem: 0,
      editedIndex: 0,

      editedItem: {
        name: ""
      },
      defaultItem: {
        name: ""
      }
    };
  },
  computed: {},
  watch: {
    error(errors) {
      this.errors = errors;
    }
  },
  //Llamar metodos al crear el componente
  created() {
    this.listar();
    this.listarAspectos();
    this.limpiar();
  },
  methods: {
    //Metodo para listar todos las campos
    listar() {
      let me = this;
      axios
        .get("Tablas_Campo")
        .then(function(response) {
          me.campos = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    listarByAspecto(value) {
      let me = this;
      axios
        .get("campos/byPlantilla/" + value)
        .then(function(response) {
          me.campos = response.data;

          me.listarByPlantilla(value);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    listarByPlantilla(value) {
      let me = this;
      axios
        .get("categorias/byPlantilla/" + value)
        .then(function(response) {
          me.categoriasbyPlantilla = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    listarByCategoria(value) {
      let me = this;
      axios
        .get("Tablas_Campo/byCategoria/" + value)
        .then(function(response) {
          me.camposbyCategoria = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    listarByCampo(value) {
      let me = this;
      axios
        .get("Tablas_Campo/byIdCampo/" + value)
        .then(function(response) {
          me.id_campo = value;
          me._id_campo = value;
          me.campos = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //Metodo para limpiar variables
    limpiar() {
      (this._id = ""),
        (this._id_campo = ""),
        (this.nombre = ""),
        (this.valor_maximo = ""),
        (this.valor_minimo = ""),
        (this.valor_defecto = ""),
        (this.rangos = ""),
        (this.visible = 1),
        (this.tipoVisible = ""),
        (this.tipoDisabled = ""),
        (this.orden = ""),
        (this.tipo = ""),
        (this.unidad = ""),
        (this.disabled = ""),
        (this.enableFields = ""),
        (this.disableFields = ""),
        (this.id_selector = ""),
        (this.id_validacion = ""),
        (this.errorM = ""),
        (this.errors = []);
      (this.verPlantillasAspectos = 0),
        (this.plantillaSeleccionada = 0),
        (this.categoriaSeleccionada = 0),
        (this.validaMensaje = []),
        (this.editedIndex = 0);
    },
    changeVisible(value) {
      if (value == "SI") {
        this.visible = 1;
      } else {
        this.visible = 0;
      }
      console.log(this.visible);
    },
    changeRequired(value) {
      if (value == "SI") {
        this.required = 1;
      } else {
        this.required = 0;
      }
    },
    changeDisabled(value) {
      if (value == "SI") {
        this.disabled = 1;
      } else {
        this.disabled = 0;
      }
    },
    //Metodo de validación para
    validarGuardado() {
      this.errors = [];

      // if (this.plantillaSeleccionada === 0) {
      //   this.errors.push("Debe seleccionar un aspecto");

      //   return false;
      // }
      // if (this.categoriaSeleccionada === 0) {
      //   this.errors.push("Debe seleccionar una categoria");

      //   return false;
      // }
      if (this._id_campo === "") {
        this.errors.push("Debe seleccionar un campo");

        return false;
      }
      if (this.nombre === "") {
        this.errors.push("Debe agregar un nombre");

        return false;
      }
      if (this.tipo === "") {
        this.errors.push("Debe agregar un tipo");

        return false;
      }
      if (this.unidad === "") {
        this.errors.push("Debe agregar una unidad");

        return false;
      }
      if (isNaN(this.valor_maximo)) {
        this.errors.push("Ingrese solo números para el valor maximo");

        return false;
      }
      if (isNaN(this.valor_minimo)) {
        this.errors.push("Ingrese solo números para el valor minimo");

        return false;
      }
      if (isNaN(this.valor_defecto)) {
        this.errors.push("Ingrese solo números para el valor por defecto");

        return false;
      }
      if (isNaN(this.rangos)) {
        this.errors.push("Ingrese solo números para el rango");

        return false;
      }
      if (isNaN(this.orden)) {
        this.errors.push("Ingrese solo números para el orden de la categoria");

        return false;
      }

      return true;
    },
    validarEditar() {
      this.errors = [];
      if (isNaN(this.valor_maximo)) {
        this.errors.push("Ingrese solo números para el valor maximo");

        return false;
      }
      if (isNaN(this.valor_minimo)) {
        this.errors.push("Ingrese solo números para el valor minimo");

        return false;
      }
      if (isNaN(this.valor_defecto)) {
        this.errors.push("Ingrese solo números para el valor por defecto");

        return false;
      }
      if (isNaN(this.rangos)) {
        this.errors.push("Ingrese solo números para el rango");

        return false;
      }
      if (isNaN(this.orden)) {
        this.errors.push("Ingrese solo números para el orden de la categoria");

        return false;
      }
      if (this.nombre === "") {
        this.errors.push("Debe agregar un nombre");

        return false;
      }
      return true;
    },
    //Metodo que permite realizar el guardado de una nueva categoria o editarla
    guardado() {
      let me = this;

      if (me.editedIndex === 0) {
        //Aca se realiza el guardado de una categoria nueva
        if (this.validarGuardado()) {
          axios
            .post("Tablas_Campo", {
              id_campo: this._id_campo,
              nombre: this.nombre,
              valor_maximo: this.valor_maximo,
              valor_minimo: this.valor_minimo,
              valor_defecto: this.valor_defecto,
              rangos: this.rangos,
              visible: this.visible,
              orden: this.orden,
              tipo: this.tipo,
              unidad: this.unidad,
              enableFields: this.enableFields,
              disableFields: this.disableFields,
              id_selector: this.id_selector,
              id_validacion: this.id_validacion,
              disabled: this.disabled
            })
            .then(function(response) {
              me.verNuevo = 0;
              me.limpiar();
              me.listar();
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      } else {
        //Aca se realiza el update de un campo ya existente
        if (this.validarEditar()) {
          axios
            .put("Tablas_Campo/" + this._id, {
              id: this._id,
              id_campo: this._id_campo,
              nombre: this.nombre,
              valor_maximo: this.valor_maximo,
              valor_minimo: this.valor_minimo,
              valor_defecto: this.valor_defecto,
              rangos: this.rangos,
              visible: this.visible,
              orden: this.orden,
              tipo: this.tipo,
              unidad: this.unidad,
              enableFields: this.enableFields,
              disableFields: this.disableFields,
              id_selector: this.id_selector,
              id_validacion: this.id_validacion,
              disabled: this.disabled
            })
            .then(function(response) {
              me.verNuevo = 0;
              me.limpiar();
              me.listar();
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      }
    },
    eliminar() {
      let me = this;

      axios
        .delete("Tablas_Campo/" + this._id, {})
        .then(function(response) {
          me.limpiar();
          me.closeEliminar();
          me.listar();
        })
        .catch(error => {
          this.errorM = "No se puede eliminar este registro";
        });
    },
    mostrarmensaje() {
      this.dialogEliminar = false;
    },

    editItem(item) {
      this._id = item.id;
      this._id_campo = item.id_campo;
      this._id_plantilla = item.id_plantilla;
      this._id_categoria = item.id_categoria;
      this.categoriaSeleccionada = item.id_categoria;
      this.plantillaSeleccionada = item.id_plantilla;
      this.nombre = item.nombre;
      this.valor_maximo = item.valor_maximo;
      this.valor_minimo = item.valor_minimo;
      this.valor_defecto = item.valor_defecto;
      this.rangos = item.rangos;
      this.orden = item.orden;
      this.tipo = item.tipo;
      this.unidad = item.unidad;
      this.disabled = item.disabled;
      this.enableCategories = item.enableCategories;
      this.enableFields = item.enableFields;
      this.disableCategories = item.disableCategories;
      this.disableFields = item.disableFields;
      this.id_selector = item.id_selector;
      this.id_validacion = item.id_validacion;
      this.visible = item.visible;
      this.required = item.required;
      this.tiposVisible(item);

      this.tiposRequired(item);
      this.tiposDisabled(item);
      this.mostrarEditar();
      this.cambiarEdited();
    },
    cambiarEdited() {
      this.editedIndex = 1;
      console.log("Cambiando el edited", this.editedIndex);
    },
    eliminarItem(item) {
      this._id = item.id;
      this.dialogEliminar = true;
      this.deleteIndex = 1;
    },
    close() {
      this.dialog = false;
    },
    closeEliminar() {
      this.errorM = "";
      this.dialogEliminar = false;
    },
    //Metodos nuevos para la segunda vista en donde se agregan las nuevas campos
    listarAspectos() {
      let me = this;
      axios
        .get("plantillas")
        .then(function(response) {
          me.plantillas = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    changePlantilla(value) {
      let me = this;
      axios
        .get("categorias/byPlantilla/" + value)
        .then(function(response) {
          me.plantillaSeleccionada = value;
          me.categoriasbyPlantilla = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    selectCategoria(value) {
      this.categoriaSeleccionada = value;
    },
    tiposVisible(item) {
      if (item.visible) {
        this.tipoVisible = "SI";
      } else {
        this.tipoVisible = "NO";
      }
    },
    tiposRequired(item) {
      if (item.required) {
        this.tipoRequired = "SI";
      } else {
        this.tipoRequired = "NO";
      }
    },
    tiposDisabled(item) {
      if (item.disabled) {
        this.tipoDisabled = "SI";
      } else {
        this.tipoDisabled = "NO";
      }
    },
    mostrarNuevo() {
      this.editedIndex = 0;
      this.verNuevo = 1;
      this.plantillaSeleccionada = 0;
      this.verPlantillasAspectos = 1;
    },
    mostrarEditar() {
      this.editedIndex = 0;
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    }
  }
};
</script>
