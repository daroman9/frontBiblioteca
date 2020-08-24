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
        <v-toolbar-title>Maestros Detail</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-layout>
          <v-select
            v-if="verNuevo==0"
            label="Maestro"
            v-bind:items="maestros"
            item-text="nombre"
            autocomplete
            no-data-text="No hay datos con esta descripción"
            item-value="id"
            persistent-hint
            single-line
            @change="listarByMaestro"
            bottom
          ></v-select>
          <v-spacer></v-spacer>
          <v-text-field
            v-if="verNuevo==0"
            class="text-xs-center"
            v-model="search"
            append-icon="search"
            label="Búsqueda"
            single-line
            hide-details
          ></v-text-field>
        </v-layout>
        <v-spacer></v-spacer>
        <v-btn color="primary" v-if="verNuevo==0" @click="mostrarNuevo()" dark class="mb-2">Nuevo</v-btn>
        <v-dialog v-model="dialogEliminar" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Eliminar Item</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md12>
                    <v-card-text>
                      ¿Estas seguro que deseas eliminar el
                      Item?
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
      </v-toolbar>
      <v-data-table
        v-if="verNuevo==0"
        :headers="headers"
        :items="plantillas"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.valor }}</td>
          <td>{{ props.item.etiqueta }}</td>
          <td>{{ props.item.id_selector }}</td>
          <td class="justify-left layout px-10">
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
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-select
              label="Maestro"
              v-model="maestroActual"
              v-bind:items="maestros"
              item-text="nombre"
              autocomplete
              no-data-text="No hay datos con esta descripción"
              item-value="id"
              persistent-hint
              single-line
              @change="seleccionarMaestro"
              bottom
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="valor" label="Valor"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="etiqueta" label="Etiqueta"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="parent_value" label="Parent Value"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="parent_selector" label="Parent Selector"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="orden" label="Orden"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 xl6>
            <v-text-field v-model="color" label="Color"></v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2 v-show="errorM">
            <div class="red--text" v-text="errorM"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12></v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click.native="guardar()">Guardar</v-btn>
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
      search: "",
      _id: "",
      _id: "",
      _id_selector: "",
      valor: "",
      etiqueta: "",
      parent_value: "",
      parent_selector: "",
      color: "",
      orden: "",
      id_selector: "",
      nombre: "",
      maestroActual: [],
      errors: [],
      valida: 0,
      verNuevo: 0,
      validaMensaje: [],
      camposbyMaestro: [],
      plantillas: [],
      maestros: [],
      errorM: null,
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Valor", value: "valor" },
        { text: "Etiqueta", value: "etiqueta" },
        { text: "Selector", value: "id_selector" },
        { text: "Opciones", value: "Opciones", sortable: false },
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
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Maestro" : "Editar Maestro";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.listar();
    this.listarmaestros();
  },
  methods: {
    listar() {
      let me = this;
      axios
        .get("Selector_Detail")
        .then(function (response) {
          me.plantillas = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    limpiar() {
      (this._id = ""),
        (this._id_selector = ""),
        (this.nombre = ""),
        (this.valor = ""),
        (this.etiqueta = ""),
        (this.parent_value = ""),
        (this.parent_selector = ""),
        (this.orden = ""),
        (this.color = ""),
        (this.validaMensaje = []),
        (this.maestroActual = []),
        (this.editedIndex = 0);
    },
    //Metodo de validación para
    validarGuardado() {
      this.errors = [];

      if (this._id_selector == null || this._id_selector == "") {
        this.errors.push("Debe seleccionar un maestro");
        return false;
      }
      if (this.valor == null || this.valor == "") {
        this.errors.push("Debe indicar un valor");
        return false;
      }
      if (isNaN(this.valor)) {
        this.errors.push("Ingrese solo números para el valor ");

        return false;
      }
      if (this.etiqueta.length < 1 || this.etiqueta.length > 50) {
        this.errors.push(
          "El nombre del Item debe tener entre 1 y 50 caracteres"
        );
        return false;
      }

      return true;
    },
    validarEditar() {
      this.errors = [];
      if (this._id_selector == null || this._id_selector == "") {
        this.errors.push("Debe seleccionar un maestro");
        return false;
      }

      if (this.valor == null || this.valor == "") {
        this.errors.push("Debe indicar un valor");
        return false;
      }
      if (isNaN(this.valor)) {
        this.errors.push("Ingrese solo números para el valor ");

        return false;
      }
      if (this.etiqueta.length < 1 || this.etiqueta.length > 50) {
        this.errors.push(
          "El nombre del Item debe tener entre 1 y 50 caracteres"
        );
        return false;
      }

      return true;
    },

    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (this.etiqueta.length < 1 || this.etiqueta.length > 50) {
        this.validaMensaje.push(
          "El nombre del Item debe tener entre 1 y 50 caracteres"
        );
      }
      if (this._id_selector == null || this._id_selector == "") {
        this.validaMensaje.push("Debe seleccionar un maestro");
      }
      if (this.valor == null || this.valor == "") {
        this.validaMensaje.push("Debe indicar un valor");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    seleccionarMaestro(value) {
      let me = this;
      me._id_selector = value;
    },
    listarByMaestro(value) {
      let me = this;
      axios
        .get("selector_detail/bySelector/" + value)
        .then(function (response) {
          me.plantillas = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarmaestros() {
      let me = this;
      axios
        .get("selectors")
        .then(function (response) {
          me.maestros = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarmaestroActual() {
      let me = this;
      axios
        .get("selectors/" + me._id_selector)
        .then(function (response) {
          me.maestroActual = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    guardar() {
      let me = this;
      if (me.editedIndex === 0) {
        //Aca se realiza el guardado de una categoria nueva
        if (this.validarEditar()) {
          axios
            .post("Selector_Detail", {
              valor: this.valor,
              etiqueta: this.etiqueta,
              parent_value: this.parent_value,
              parent_selector: this.parent_selector,
              id_selector: this._id_selector,
              color: this.color,
              orden: this.orden,
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
        //Aca se realiza el update de un campo ya existente
        if (this.validarEditar()) {
          axios
            .put("Selector_Detail/" + this._id, {
              id: this._id,
              valor: this.valor,
              etiqueta: this.etiqueta,
              parent_value: this.parent_value,
              parent_selector: this.parent_selector,
              id_selector: this._id_selector,
              color: this.color,
              orden: this.orden,
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

    eliminar() {
      let me = this;
      axios
        .delete("Selector_Detail/" + this._id, {})
        .then(function (response) {
          me.limpiar();
          me.closeEliminar();
          me.listar();
        })
        .catch((error) => {
          this.errorM = "No se puede eliminar este registro";
        });
    },
    mostrarmensaje() {
      this.dialogEliminar = false;
    },
    mostrarNuevo() {
      this.editedIndex = 0;
      this.verNuevo = 1;
    },

    editItem(item) {
      this._id = item.id;
      this.valor = item.valor;
      this.etiqueta = item.etiqueta;
      this.parent_value = item.parent_value;
      this.parent_selector = item.parent_selector;
      this._id_selector = item.id_selector;
      this.color = item.color;
      this.orden = item.color;
      this.mostrarEditar();
      this.listarmaestroActual();
      this.cambiarEdited();
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
      this.dialogEliminar = false;
    },
    mostrarEditar() {
      this.editedIndex = 0;
      this.verNuevo = 1;
    },

    cambiarEdited() {
      this.editedIndex = 1;
      console.log("Cambiando el edited", this.editedIndex);
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
  },
};
</script>
