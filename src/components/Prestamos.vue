<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Prestamos</v-toolbar-title>
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
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Prestamo</v-btn>
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
                      v-model="nombreMaterial"
                      label="Nombre Material"
                    ></v-text-field>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="nombreUsuario"
                      label="Nombre Usuario"
                    ></v-text-field>
                  </v-flex>
                   <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="apellidoUsuario"
                      label="Apellido Usuario"
                    ></v-text-field>
                  </v-flex>
                   <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="FechaInicial"
                      label="Fecha Inicial"
                    ></v-text-field>
                  </v-flex>
                   <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="fechaFinal"
                      label="Fecha Final"
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
              <span class="headline">Eliminar Prestamo</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md12>
                    <v-card-text
                      >¿Estas seguro que deseas eliminar el prestamo?</v-card-text
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
        :items="prestamos"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.nombreMaterial }}</td>
          <td>{{ props.item.nombreUsuario }}</td>
          <td>{{ props.item.apellidoUsuario }}</td>
          <td>{{ props.item.fechaInicial }}</td>
          <td>{{ props.item.fechaFinal }}</td>
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
      idMaterial:"",
      nombreMaterial: "",
      idUsuario: "",
      nombreUsuario: "",
      apellidoUsuario:"",
      fechaInicial:"",
      fechaFinal:"",
      valida: 0,
      errors: [],
      validaMensaje: [],
      prestamos: [],
      errorM: null,
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Nombre Material", value: "nombreMaterial", sortable: true },
        { text: "Nombre Usuario", value: "nombreUsuario", sortable: true },
        { text: "Apellido Usuario", value: "apellidoUsuario", sortable: true },
        { text: "Fecha Inicial", value: "fechaInicial", sortable: false },
        { text: "Fecha Final", value: "fechaFinal", sortable: false },
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
      return this.editedIndex === -1 ? "Nuevo Prestamo" : "Editar Prestamo";
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
        .get("DatosPrestamo")
        .then(function(response) {
          me.prestamos = response.data;
          console.log(me.prestamos)
        }
    )
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      (this._id = ""),
      (this.idMaterial = ""),
      (this.nombreMaterial = ""),
      (this.idUsuario = ""),
      (this.nombreUsuario = ""),
      (this.apellidoUsuario = ""),
      (this.fechaInicial = ""),
      (this.fechaFinal = ""),
      (this.validaMensaje = []),
      (this. errors= []),
      (this.editedIndex = -1);
    },
     //Metodo de validación para
    validarGuardado() {
      this.errors = [];
       if (this.nombre === "") {
        this.errors.push("Debe agregar un nombre");
        return false;
      }
      if (this.apellido === "") {
        this.errors.push("Debe agregar un apellido");
        return false;
      }
      if (this.nombreAcudiente === "") {
        this.errors.push("Debe agregar un nombre de acudiente");
        return false;
      }
      if (this.apellidoAcudiente === "") {
        this.errors.push("Debe agregar un apellido para el acudiente");
        return false;
      }
      if (this.telefonoAcudiente === "") {
        this.errors.push("Debe agregar un teléfono para el acudiente");
        return false;
      }
      if (this.autorizacion === "") {
        this.errors.push("Debe especificar la autorización");
        return false;
      }
      if (this.activo === "") {
        this.errors.push("Debe especificar si el alumno esta activo");
        return false;
      }
      return true;
    },
    validarEditar() {
      this.errors = [];
       if (this.nombre === "") {
        this.errors.push("Debe agregar un nombre");
        return false;
      }
      if (this.apellido === "") {
        this.errors.push("Debe agregar un apellido");
        return false;
      }
      if (this.nombreAcudiente === "") {
        this.errors.push("Debe agregar un nombre de acudiente");
        return false;
      }
      if (this.apellidoAcudiente === "") {
        this.errors.push("Debe agregar un apellido para el acudiente");
        return false;
      }
      if (this.telefonoAcudiente === "") {
        this.errors.push("Debe agregar un teléfono para el acudiente");
        return false;
      }
      if (this.autorizacion === "") {
        this.errors.push("Debe especificar la autorización");
        return false;
      }
      if (this.activo === "") {
        this.errors.push("Debe especificar si el alumnos esta activo");
        return false;
      }
      return true;
    },
    guardar() {
      let me = this;
     
      if (this.editedIndex > -1) {
        //Codigo para editar un usuario
         if (this.validarGuardado()) {
     
        axios
          .put("Detalle_Usuarios/" + this._id, {
            id: this._id,
            nombre: this.nombre,
            apellido: this.apellido,
            grado: this.grado,
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
        }
      } else {
        if(this.validarEditar()){
        //Codigo para guardar un nuevo usuario
        axios
          .post("Detalle_Usuarios", {
            nombre: this.nombre,
            apellido: this.apellido,
            grado: this.grado,
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
      }
        }
    },
    eliminar() {
      let me = this;
      axios
        .delete("Detalle_Usuarios/" + this._id, {})
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
      this.nombreMaterial = item.nombreMaterial;
      this.nombreUsuario = item.nombreUsuario;
      this.apellidoUsuario= item.apellidoUsuario;
      this.fechaInicial = item.fechaInicial;
      this.fechaFinal= item.fechaFinal;
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
     
        this.autorizacion = value;
        console.log(this.autorizacion);
    
    },
    changeActivo(value) {
    
        this.activo = value;
        console.log(this.activo);
    
    },

  },
};
</script>
