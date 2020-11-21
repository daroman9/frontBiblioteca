<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Buscar por Usuario</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="searchUsuario"
          append-icon="search"
          label="Búsqueda"
        ></v-text-field>
           <v-text-field
          class="text-xs-center"
          v-model="documentoUsuario"
          label="Ingrese documento"
        ></v-text-field>
          <v-btn color="primary" @click="listarByUsuario()">Buscar</v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="prestamosByUsuario"
        :search="searchUsuario"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.nombreAlumno }}</td>
          <td>{{ props.item.apellidoAlumno }}</td>
          <td>{{ props.item.documentoAlumno }}</td>
          <td>{{ props.item.nombreMaterial }}</td>
          <td>{{ props.item.fechaInicial }}</td>
          <td>{{ props.item.fechaFinal }}</td>
        </template>
        <template v-slot:no-data>
        </template>
      </v-data-table>
      <!--Buscar por grado-->
      <br><br><br><br>
      <v-toolbar flat color="white">
        <v-toolbar-title>Buscar por Grado</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="searchGrado"
          append-icon="search"
          label="Búsqueda"
        ></v-text-field>
           <v-text-field
          class="text-xs-center"
          v-model="grado"
          label="Ingrese grado"
        ></v-text-field>
           <v-btn color="primary" @click="listarByGrado()">Buscar</v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="prestamosByGrado"
        :search="searchGrado"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.nombreAlumno }}</td>
          <td>{{ props.item.apellidoAlumno }}</td>
          <td>{{ props.item.documentoAlumno }}</td>
          <td>{{ props.item.nombreMaterial }}</td>
          <td>{{ props.item.fechaInicial }}</td>
          <td>{{ props.item.fechaFinal }}</td>
        </template>
        <template v-slot:no-data>
        </template>
      </v-data-table>
         <!--Buscar por material de prestamo-->
      <br><br><br><br>
      <v-toolbar flat color="white">
        <v-toolbar-title>Buscar por Material</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="searchMaterial"
          append-icon="search"
          label="Búsqueda"
        ></v-text-field>
        <v-text-field
          class="text-xs-center"
          v-model="material"
          label="Ingrese material"
        ></v-text-field>
          <v-btn color="primary" @click="listarByMaterial()">Buscar</v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="prestamosByMaterial"
        :search="searchMaterial"
        class="elevation-1"
      >
        <template v-slot:items="props">
         <td>{{ props.item.nombreAlumno }}</td>
          <td>{{ props.item.apellidoAlumno }}</td>
          <td>{{ props.item.documentoAlumno }}</td>
          <td>{{ props.item.nombreMaterial }}</td>
          <td>{{ props.item.fechaInicial }}</td>
          <td>{{ props.item.fechaFinal }}</td>
        </template>
        <template v-slot:no-data>
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
      searchUsuario: "",
      searchGrado: "",
      searchMaterial: "",
      documentoUsuario:"",
      grado:"",
      material:"",
      prestamosByUsuario:[],
      prestamosByGrado:[],
      prestamosByMaterial:[],

      errorM: null,
      headers: [
        { text: "Nombre Alumno", value: "nombreAlumno", sortable: true },
        { text: "Apellido Alumno", value: "apellidoAlumno", sortable: true },
        { text: "Documento", value: "documentoAlumno", sortable: true },
        { text: "Nombre Material", value: "nombreMaterial", sortable: true },
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
  },
  methods: {
    listarByUsuario() {
      let me = this;
      axios
        .get("ListarPrestamoUsuario/"+ this.documentoUsuario)
        .then(function(response) {
          me.prestamosByUsuario = response.data;
          console.log(me.prestamos)
        }
    )
        .catch(function(error) {
          console.log(error);
        });
    },
    listarByGrado() {
      let me = this;
      axios
        .get("ListarPrestamoGrado/"+ this.grado)
        .then(function(response) {
          me.prestamosByGrado = response.data;
          console.log(me.prestamos)
        }
    )
        .catch(function(error) {
          console.log(error);
        });
    },
    listarByMaterial() {
      let me = this;
      axios
        .get("ListarPrestamoMaterial/"+ this.material)
        .then(function(response) {
          me.prestamosByMaterial = response.data;
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
      (this.gradoSeleccionado=""),
      (this.nombreUsuario = ""),
      (this.apellidoUsuario = ""),
      (this.fechaInicial = ""),
      (this.fechaFinal = ""),
      (this.dateInicio = ""),
      (this.dateFinal = ""),
      (this.validaMensaje = []),
      (this. errors= []),
      (this.editedIndex = -1);
    },   
  }
};
</script>
