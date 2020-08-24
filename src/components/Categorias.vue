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
        <v-toolbar-title>Categorias</v-toolbar-title>
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
            @change="listarByAspecto"
            bottom
          ></v-select>
          <v-btn color="primary" v-if="verNuevo==0" @click="listar()" dark class="mb-2">Todos</v-btn>

          <v-btn color="primary" v-if="verNuevo==0" @click="mostrarNuevo()" dark class="mb-2">Nuevo</v-btn>
        </v-layout>

        <!--Dialog para eliminar una categoria-->
        <v-dialog v-model="dialogEliminar" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Eliminar Categoria</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md12>
                    <v-card-text>
                      ¿Estas seguro que deseas eliminar la
                      Categoria?
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
      <!--DataTable para mostrar todas las categorias-->
      <v-data-table
        v-if="verNuevo==0"
        :headers="headers"
        :items="categorias"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.id_padre }}</td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.orden }}</td>
          <td>{{ props.item.visible }}</td>
          <td>{{ props.item.color }}</td>
          <td>{{ props.item.image }}</td>
          <td>{{ props.item.id_plantilla }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon small class="mr-2" @click="eliminarItem(props.item)">delete</v-icon>
          </td>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Resetear</v-btn>
        </template>
      </v-data-table>
      <!--Container para nuevo ingreso de categoria-->

      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-flex>
          <v-switch
            v-if="verSwitch==1"
            v-model="switch1"
            :label="`Categoria Principal`"
            @change="changePrimaryCategory"
          ></v-switch>
        </v-flex>
        <v-layout row wrap>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-select
              v-if="verPlantillasAspectos==1"
              label="Aspecto"
              v-bind:items="plantillas"
              item-text="nombre"
              autocomplete
              no-data-text="No hay datos con esta descripción"
              item-value="id"
              persistent-hint
              single-line
              @change="changePlantilla"
              bottom
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-select
              v-if="verPlantillasAspectos==1"
              label="Nombre Categoria"
              v-bind:items="categoriasbyPlantilla"
              item-text="nombre"
              autocomplete
              no-data-text="No hay datos con esta descripción"
              item-value="id"
              persistent-hint
              single-line
              @change="selectCategoria"
              bottom
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="nombre" label="Nombre"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="orden" label="Orden"></v-text-field>
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
            <v-text-field v-model="color" label="Color"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="image" label="Imagen"></v-text-field>
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
      nombre: "",
      orden: "",
      visible: "",
      color: "",
      image: "",
      tipoVisible: "",
      switch1: true,
      plantillaSeleccionada: 0,
      categoriaSeleccionada: 0,
      verPlantillasAspectos: 0,
      verSwitch: 0,
      errors: [],
      Aspectos: [],
      valida: 0,
      validaMensaje: [],
      categorias: [],
      categoriasbyPlantilla: [],
      plantillas: [],
      errorM: null,
      verNuevo: 0,
      buscarPlantilla: 0,
      //Headers para el data table que muestra todas las categorias
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "ID_Padre", value: "id_padre", sortable: false },
        { text: "Nombre", value: "nombre", sortable: false },
        { text: "Orden", value: "orden", sortable: false },
        { text: "Visible", value: "visible", sortable: false },
        { text: "Color", value: "color", sortable: false },
        { text: "Imagen", value: "image", sortable: false },
        { text: "ID_Plantilla", value: "id_plantilla", sortable: false },
      ],
      deleteItem: 0,
      editedIndex: 0,

      editedItem: {
        name: "",
      },
      defaultItem: {
        name: "",
      },
    };
  },
  computed: {},
  watch: {
    error(errors) {
      this.errors = errors;
    },
  },
  //Llamar metodos al crear el componente
  created() {
    this.listar();
    this.listarAspectos();
    this.limpiar();
  },
  methods: {
    //Metodo para listar todos las categorias
    listar() {
      let me = this;
      axios
        .get("categorias")
        .then(function (response) {
          me.categorias = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    listarByAspecto(value) {
      let me = this;
      axios
        .get("categorias/byPlantilla/" + value)
        .then(function (response) {
          me.categorias = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //Metodo para limpiar variables
    limpiar() {
      (this._id = ""),
        (this.nombre = ""),
        (this.orden = ""),
        (this.visible = ""),
        (this.tipoVisible = ""),
        (this.color = ""),
        (this.image = ""),
        (this.errorM = ""),
        (this.errors = []);
      (this.verPlantillasAspectos = 0),
        (this.plantillaSeleccionada = 0),
        (this.categoriaSeleccionada = 0),
        (this.switch1 = false),
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
    //Metodo de validación para
    validarGuardado() {
      this.errors = [];

      if (this.plantillaSeleccionada === 0) {
        this.errors.push("Debe seleccionar un aspecto");

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
    validarEditar() {
      this.errors = [];
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
      if (me.editedIndex === 0 && me.plantillaSeleccionada != null) {
        //Aca se realiza el guardado de una categoria nueva
        if (this.validarGuardado() && me.categoriaSeleccionada != "") {
          axios
            .post("categorias", {
              id_plantilla: this.plantillaSeleccionada,
              id_padre: this.categoriaSeleccionada,
              nombre: this.nombre,
              orden: this.orden,
              visible: this.visible,
              color: this.color,
              image: this.image,
            })
            .then(function (response) {
              me.verNuevo = 0;
              me.limpiar();
              me.listar();
            })
            .catch(function (error) {
              console.log(error);
            });
        } else if (this.validarGuardado()) {
          axios
            .post("categorias", {
              id_plantilla: this.plantillaSeleccionada,
              nombre: this.nombre,
              nombre: this.nombre,
              orden: this.orden,
              visible: this.visible,
              color: this.color,
              image: this.image,
            })
            .then(function (response) {
              me.verNuevo = 0;
              me.limpiar();
              me.listar();
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      } else {
        //Aca se realiza el update de una categoria ya existente
        console.log("Entro al editar");
        console.log("este es el id padre " + this._id_padre);
        if (this.validarEditar()) {
          axios
            .put("categorias/" + this._id, {
              id: this._id,
              id_plantilla: this._id_plantilla,
              id_padre: this.categoriaSeleccionada,
              nombre: this.nombre,
              orden: this.orden,
              visible: this.visible,
              color: this.color,
              image: this.image,
            })
            .then(function (response) {
              me.verNuevo = 0;
              me.limpiar();
              me.listar();
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    },

    editar() {
      if (this.validarEdicion()) {
        return;
      }
      //Codigo para editar una categoria
      axios
        .put("categorias/" + this._id, {
          id: this._id,
          id_plantilla: this._id_plantilla,
          nombre: this.nombre,
          orden: this.orden,
          visible: this.visible,
          color: this.color,
          image: this.image,
        })
        .then(function (response) {
          me.verNuevo = 0;
          me.limpiar();
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //Metodo para eliminar una categoria

    eliminar() {
      let me = this;
      if (me._id_padre == null) {
        axios
          .delete("categorias/" + this._id, {})
          .then(function (response) {
            me.limpiar();
            me.closeEliminar();
            me.listar();
          })
          .catch((error) => {
            this.errorM = "No se puede eliminar este registro";
          });
      } else {
        this.errorM = "No se puede eliminar este registro";
      }
    },
    mostrarmensaje() {
      this.dialogEliminar = false;
    },

    editItem(item) {
      this._id = item.id;
      this._id_plantilla = item.id_plantilla;
      this.categoriaSeleccionada = item.id_padre;
      this.nombre = item.nombre;
      this.orden = item.orden;
      this.visible = item.visible;
      this.color = item.color;
      this.image = item.image;
      this.verSwitch = 1;
      this.tiposVisible(item);
      this.mostrarEditar();
      this.cambiarEdited();
      this.validarCategoria();
    },
    validarCategoria() {
      if (
        this.categoriaSeleccionada == null ||
        this.categoriaSeleccionada == "" ||
        this.categoriaSeleccionada == 0
      ) {
        this.switch1 = true;
        this.verPlantillasAspectos = 0;
      } else {
        this.switch1 = false;
        this.verPlantillasAspectos = 1;
      }
    },
    cambiarEdited() {
      this.editedIndex = 1;
      console.log("Cambiando el edited", this.editedIndex);
    },
    eliminarItem(item) {
      this._id = item.id;
      this._id_padre = item.id_padre;
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
    //Metodos nuevos para la segunda vista en donde se agregan las nuevas categorias
    listarAspectos() {
      let me = this;
      axios
        .get("plantillas")
        .then(function (response) {
          me.plantillas = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    changePlantilla(value) {
      let me = this;
      axios
        .get("categorias/byPlantilla/" + value)
        .then(function (response) {
          me.plantillaSeleccionada = value;
          me.categoriasbyPlantilla = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    selectCategoria(value) {
      this.categoriaSeleccionada = value;
    },
    tiposVisible(item) {
      console.log(item.visible);

      if (item.visible) {
        this.tipoVisible = "SI";
      } else {
        this.tipoVisible = "NO";
      }
    },
    mostrarNuevo() {
      this.editedIndex = 0;
      this.verNuevo = 1;
      this.verSwitch = 0;
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
    },
    changePrimaryCategory() {
      if (this.switch1 == true) {
        this.verPlantillasAspectos = 0;
      } else if (this.switch1 == false) {
        this.verPlantillasAspectos = 1;
      }
    },
  },
};
</script>
