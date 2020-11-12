<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Usuarios</v-toolbar-title>
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
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Usuario</v-btn>
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
                      label="Nombres"
                    ></v-text-field>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="apellido"
                      label="Apellidos"
                    ></v-text-field>
                  </v-flex>
                   <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="grado"
                      label="Grado"
                    ></v-text-field>
                  </v-flex>
                   <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="nombreAcudiente"
                      label="Nombres Acudiente"
                    ></v-text-field>
                  </v-flex>
                   <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="apellidoAcudiente"
                      label="Apellidos Acudiente"
                    ></v-text-field>
                  </v-flex>
                   <v-spacer></v-spacer>

            <v-flex xs12 sm6 md6 lg6 xl6>
            <label>Autorización</label>
            <v-select
              v-bind:items="['Si', 'No']"
              autocomplete
              v-model="autorizacion"
              no-data-text="No hay datos con esta descripción"
              item-value="autorizacion"
              persistent-hint
              single-line
              @change="changeAutorizacion"
              bottom
            ></v-select>
          </v-flex>
            <v-flex xs12 sm6 md6 lg6 xl6>
            <label>Activo</label>
            <v-select
              v-bind:items="['Si', 'No']"
              autocomplete
              v-model="activo"
              no-data-text="No hay datos con esta descripción"
              item-value="activo"
              persistent-hint
              single-line
              @change="changeActivo"
              bottom
            ></v-select>
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
              <span class="headline">Eliminar plantilla</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md12>
                    <v-card-text
                      >¿Estas seguro que deseas eliminar el usuario?</v-card-text
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
        :items="usuarios"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.nombre }}</td>
          <td>{{ props.item.apellido }}</td>
          <td>{{ props.item.grado }}</td>
          <td>{{ props.item.nombreAcudiente }}</td>
          <td>{{ props.item.apellidoAcudiente }}</td>
          <td>{{ props.item.telefonoAcudiente }}</td>
          <td>{{ props.item.autorizacion }}</td>
          <td>{{ props.item.activo }}</td>
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
      apellido: "",
      grado: "",
      nombreAcudiente:"",
      apellidoAcudiente:"",
      telefonoAcudiente:"",
      autorizacion:"",
      activo:"",
      valida: 0,
      validaMensaje: [],
      usuarios: [],
      errorM: null,
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Nombres", value: "nombre", sortable: true },
        { text: "Apellidos", value: "apellido" },
        { text: "Grado", value: "grado" },
        { text: "Nombres Acudiente", value: "nombreAcudiente", sortable: false },
        { text: "Apellidos Acudiente", value: "apellidoAcudiente", sortable: false },
        { text: "Teléfono Acudiente", value: "telefonoAcudiente", sortable: false },
        { text: "Autorización", value: "autorizacion", sortable: false },
        { text: "Activo", value: "activo", sortable: false },
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
      return this.editedIndex === -1 ? "Nuevo Usuario" : "Editar Usuario";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.listar();
  },
  methods: {
    listar() {
      let me = this;
      axios
        .get("Detalle_Usuarios")
        .then(function(response) {
          me.usuarios = response.data;
          //Ciclo for que cambia el valor númerico de autorización y activo a Si y No
          for(let i=0; i < me.usuarios.length ; i++){
            if(me.usuarios[0].autorizacion == 1){
              me.usuarios[0].autorizacion = "Si";
            }
            else{
              me.usuarios[0].autorizacion = "No";
            }
            if(me.usuarios[0].activo == 1){
              me.usuarios[0].activo = "Si";
            }
            else{
              me.usuarios[0].activo = "No";
            }
         }
         //Fin ciclo for
        }
    )
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      (this._id = ""),
        (this.nombre = ""),
        (this.imagenUrl = ""),
        (this.validaMensaje = []),
        (this.editedIndex = -1);
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (this.nombre.length < 1 || this.nombre.length > 50) {
        this.validaMensaje.push(
          "El nombre de la Plantilla debe tener entre 1 y 50 caracteres"
        );
      }
      if (this.imageUrl.length < 1 || this.imageUrl.length > 50) {
        this.validaMensaje.push(
          "La Url de la imagen debe tener entre 1 y 50 caracteres"
        );
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    guardar() {
      let me = this;
      //if (this.validar()) {
       // return;
     // }
      if (this.editedIndex > -1) {
        //Codigo para editar un usuario
        axios
          .put("Detalle_Usuarios/" + this._id, {
            id: this._id,
            nombre: this.nombre,
            apellido: this.apellido,
            nombreAcudiente: this.nombreAcudiente,
            apellidoAcudiente: this.apellidoAcudiente,
            telefonoAcudiente: this.telefonoAcudiente,
            autorizacion: this.autorizacion,
            activo: this.activo
          })
          .then(function(response) {
            me.limpiar();
            me.close();
            me.listar();
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        //Codigo para guardar una nueva plantilla
        axios
          .post("plantillas", {
            nombre: this.nombre,
            imageUrl: this.imageUrl,
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
    },
    eliminar() {
      let me = this;
      axios
        .delete("plantillas/" + this._id, {})
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
      this.apellido = item.apellido;
      this.grado= item.grado;
      this.nombreAcudiente = item.nombreAcudiente;
      this.apellidoAcudiente= item.apellidoAcudiente;
      this.telefonoAcudiente= item.telefonoAcudiente;
      this.autorizacion= item.autorizacion;
      this.activo = item.activo;
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
    },
    changeAutorizacion(value) {
      if (value == "Si") {
        this.autorizacion = 1;
      } else {
        this.autorizacion = 0;
      }
    },
    changeActivo(value) {
      if (value == "Si") {
        this.activo = 1;
      } else {
        this.activo = 0;
      }
    },

  },
};
</script>
