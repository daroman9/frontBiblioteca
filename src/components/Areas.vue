<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Areas</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Nueva Area</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-flex>            
                  <v-flex xs12 sm6 md12 v-show="valida">
                    <div
                      class="red--text"
                      v-for="v in validaMensaje"
                      :key="v"
                      v-text="v"
                    ></div>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogEliminar" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Eliminar Area</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md12>
                    <v-card-text
                      >¿Estas seguro que deseas eliminar el area?</v-card-text
                    >
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12 class="red--text" v-if="errorM">
                    {{ errorM }}
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="closeEliminar"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" flat @click="eliminar"
                >Guardar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="areas"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.nombre }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)"
              >edit</v-icon
            >
            <v-icon small class="mr-2" @click="eliminarItem(props.item)"
              >delete</v-icon
            >
          </td>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Resetear</v-btn>
        </template>
      </v-data-table>
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
      nombre: "",
      valida: 0,
      errors: [],
      validaMensaje: [],
      areas: [],
      errorM: null,
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Nombre", value: "nombre", sortable: true },
      ],
      deleteItem: -1,
      editedIndex: -1,
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
      return this.editedIndex === -1 ? "Nueva Area" : "Editar Area";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
       error(errors) {
      this.errors = errors;
    }
  },
  created() {
    this.listar();
  },
  methods: {
    listar() {
      let me = this;
      axios
        .get("Areas")
        .then(function(response) {
          me.areas = response.data;
        }
    )
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      (this._id = ""),
        (this.nombre = ""),
        (this.validaMensaje = []),
        (this. errors= []),
        (this.editedIndex = -1);
    },
     //Metodo de validación para guardar
    validarGuardado() {
      this.errors = [];
       if (this.nombre === "") {
        this.errors.push("Debe agregar un nombre");
        return false;
      }
      return true;
    },
    //Metodo de validacion para editar
    validarEditar() {
      this.errors = [];
       if (this.nombre === "") {
        this.errors.push("Debe agregar un nombre");
        return false;
      }
      return true;
    },
    guardar() {
      let me = this;
     
      if (this.editedIndex > -1) {
        //Codigo para editar un usuario
         if (this.validarEditar()) {
     
        axios
          .put("Areas/" + this._id, {
            id: this._id,
            nombre: this.nombre
          })
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
        }
      } else {
        if(this.validarGuardado()){
        //Codigo para guardar un nuevo usuario
        axios
          .post("Areas", {
            nombre: this.nombre
          })
          .then(function(response) {
            me.limpiar();
            me.close();
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
        .delete("Areas/" + this._id, {})
        .then(function(response) {
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

    editItem(item) {
      this._id = item.id;
      this.nombre = item.nombre;
      this.dialog = true;
      this.editedIndex = 1;
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
    }
  },
};
</script>
