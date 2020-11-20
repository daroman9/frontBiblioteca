<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Material de Prestamo</v-toolbar-title>
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
            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Material de Prestamo</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                  <label>Areas</label>
                  <v-select
                   :label="`${nombreArea}`"
                    v-bind:items="areas"
                    item-text="nombre"
                    autocomplete
                    no-data-text="No hay datos con esta descripción"
                    item-value="id"
                    persistent-hint
                    single-line
                    @change="selectArea"
                    bottom
                  ></v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                  <label>Tipo de Materiales</label>
                  <v-select
                    :label="`${nombreTipoMaterial}`"
                    v-bind:items="tipoMateriales"
                    item-text="nombre"
                    autocomplete
                    no-data-text="No hay datos con esta descripción"
                    item-value="id"
                    persistent-hint
                    single-line
                    @change="selectTipoMaterial"
                    bottom
                  ></v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                  <label>Dispositivos</label>
                  <v-select
                    :label="`${nombreDispositivo}`"
                    v-bind:items="dispositivos"
                    item-text="nombre"
                    autocomplete
                    no-data-text="No hay datos con esta descripción"
                    item-value="id"
                    persistent-hint
                    single-line
                    @change="selectDispositivo"
                    bottom
                  ></v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                  <label>Editoriales</label>
                  <v-select
                    :label="`${nombreEditorial}`"
                    v-bind:items="editoriales"
                    item-text="nombre"
                    autocomplete
                    no-data-text="No hay datos con esta descripción"
                    item-value="id"
                    persistent-hint
                    single-line
                    @change="selectEditorial"
                    bottom
                  ></v-select>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="nombreMaterial"
                      label="Nombre Material"
                    ></v-text-field>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="cantidad"
                      label="Cantidad"
                    ></v-text-field>
                  </v-flex>
                   <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="observacion"
                      label="Observación"
                    ></v-text-field>
                  </v-flex>
                   <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="iesbn"
                      label="Iesbn"
                    ></v-text-field>
                  </v-flex>
                   <v-spacer></v-spacer>
                  <v-flex xs12 sm6 md12>
                    <v-text-field
                      v-model="grado"
                      label="Grado"
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
              <span class="headline">Eliminar Material de Prestamo</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md12>
                    <v-card-text
                      >¿Estas seguro que deseas eliminar el material de prestamo?</v-card-text
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
        :items="materialesPrestamo"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.nombreMaterial }}</td>
          <td>{{ props.item.cantidad }}</td>
          <td>{{ props.item.observacion }}</td>
          <td>{{ props.item.iesbn }}</td>
          <td>{{ props.item.grado }}</td>
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
      areaSeleccionada:0,
      tipoMaterialSeleccionado:0,
      dispositivoSeleccionado:0,
      editorialSeleccionada:0,
      nombreMaterial: "",
      cantidad:"",
      observacion: "",
      iesbn:"",
      grado:"",
      nombreTipoMaterial:"",
      nombreArea:"",
      nombreDispositivo:"",
      nombreEditorial:"",
      valida: 0,
      errors: [],
      tipoMateriales:[],
      areas: [],
      dispositivos:[],
      editoriales:[],
      validaMensaje: [],
      materialesPrestamo: [],
      errorM: null,
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Nombre", value: "nombreMaterial", sortable: true },
        { text: "Cantidad", value: "cantidad", sortable: true },
        { text: "Observación", value: "observacion", sortable: true },
        { text: "Iesbn", value: "iesbn", sortable: true },
        { text: "Grado", value: "grado", sortable: true }
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
      return this.editedIndex === -1 ? "Nuevo Material de Prestamo" : "Editar Material de Prestamo";
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
    this.listarAreas();
    this.listarTipoMateriales();
    this.listarDispositivos();
    this.listarEditoriales();
  },
  methods: {
    listar() {
      let me = this;
      axios
        .get("Material_Prestamos")
        .then(function(response) {
          me.materialesPrestamo = response.data;
        }
    )
        .catch(function(error) {
          console.log(error);
        });
    },
      listarAreas() {
      let me = this;
      axios
        .get("Areas")
        .then(function (response) {
          me.areas = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarTipoMateriales() {
      let me = this;
      axios
        .get("Tipo_Materiales")
        .then(function (response) {
          me.tipoMateriales = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
        listarDispositivos() {
      let me = this;
      axios
        .get("Dispositivos")
        .then(function (response) {
          me.dispositivos = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    
        listarEditoriales() {
      let me = this;
      axios
        .get("Editoriales")
        .then(function (response) {
          me.editoriales = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
     listarTipoMaterialById(value) {
      let me = this;
      axios
        .get("Tipo_Materiales/" + value)
        .then(function (response) {
          me.nombreTipoMaterial = response.data.nombre;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
     listarAreaById(value) {
      let me = this;
      axios
        .get("Areas/" + value)
        .then(function (response) {
          me.nombreArea = response.data.nombre;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarDispositivoById(value) {
      let me = this;
      axios
        .get("Dispositivos/" + value)
        .then(function (response) {
          me.nombreDispositivo = response.data.nombre;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarEditorialById(value) {
      let me = this;
      axios
        .get("Editoriales/" + value)
        .then(function (response) {
          me.nombreEditorial = response.data.nombre;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    limpiar() {
      (this._id = ""),
        (this.nombreMaterial = ""),
        (this.apellido = ""),
        (this.grado = ""),
        (this.nombreAcudiente = ""),
        (this.apellidoAcudiente = ""),
        (this.telefonoAcudiente = ""),
        (this.autorizacion = ""),
        (this.nombreTipoMaterial = ""),
        (this.nombreArea = ""),
        (this.nombreDispositivo = ""),
        (this.nombreEditorial = ""),
        (this.cantidad=""),
        (this.observacion=""),
        (this.iesbn=""),
        (this.tipoMaterialSeleccionado=0),
        (this.areaSeleccionada=0),
        (this.dispositivoSeleccionado=0),
        (this.editorialSeleccionada=0),
        (this.validaMensaje = []),
        (this. errors= []),
        (this.editedIndex = -1);
    },
     //Metodo de validación para
    validarGuardado() {
      this.errors = [];
       if (this.areaSeleccionada === 0) {
        this.errors.push("Debe seleccionar un area ");
        return false;
      }
      if (this.tipoMaterialSeleccionado === 0) {
        this.errors.push("Debe seleccionar un tipo de material");
        return false;
      }
      if (this.nombreMaterial === "") {
        this.errors.push("Debe agregar un un nombre de material");
        return false;
      }
      if (isNaN(this.cantidad)) {
        this.errors.push("Ingrese solo números para la cantidad");
        return false;
      }
      if (this.iesbn === "") {
        this.errors.push("Debe agregar el Iesbn");
        return false;
      }
      if (this.grado === "") {
        this.errors.push("Debe agregar el grado");
        return false;
      }
      return true;
    },
    validarEditar() {
       this.errors = [];
       if (this.areaSeleccionada === 0) {
        this.errors.push("Debe seleccionar un area ");
        return false;
      }
      if (this.tipoMaterialSeleccionado === 0) {
        this.errors.push("Debe seleccionar un tipo de material");
        return false;
      }
      if (this.nombreMaterial === "") {
        this.errors.push("Debe agregar un un nombre de material");
        return false;
      }
      if (isNaN(this.cantidad)) {
        this.errors.push("Ingrese solo números para la cantidad");
        return false;
      }
      if (this.iesbn === "") {
        this.errors.push("Debe agregar el Iesbn");
        return false;
      }
      if (this.grado === "") {
        this.errors.push("Debe agregar el grado");
        return false;
      }
      return true;
    },
    guardar() {
      let me = this;
     
      if (this.editedIndex > -1) {
        //Codigo para editar un material de prestamo
         if (this.validarGuardado()) {
     
        axios
          .put("Material_Prestamos/" + this._id, {
            id: this._id,
            id_Area: this.areaSeleccionada,
            id_TipoMaterial: this.tipoMaterialSeleccionado,
            id_Dispositivos: this.dispositivoSeleccionado,
            id_Editorial: this.editorialSeleccionada,
            nombreMaterial: this.nombreMaterial,
            cantidad: this.cantidad,
            observacion: this.observacion,
            iesbn: this.iesbn,
            grado: this.grado
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
        //Codigo para guardar un nuevo material de prestamo
        axios
          .post("Material_Prestamos", {
            id_Area: this.areaSeleccionada,
            id_TipoMaterial: this.tipoMaterialSeleccionado,
            id_Dispositivos: this.dispositivoSeleccionado,
            id_Editorial: this.editorialSeleccionada,
            nombreMaterial: this.nombreMaterial,
            cantidad: this.cantidad,
            observacion: this.observacion,
            iesbn: this.iesbn,
            grado: this.grado
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
        .delete("Material_Prestamos/" + this._id, {})
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
      this.areaSeleccionada = item.id_Area,
      this.tipoMaterialSeleccionado = item.id_TipoMaterial,
      this.dispositivoSeleccionado = item.id_Dispositivos,
      this.editorialSeleccionada = item.id_Editorial,
      this.nombreMaterial = item.nombreMaterial;
      this.cantidad = item.cantidad;
      this.observacion= item.observacion;
      this.iesbn = item.iesbn;
      this.grado= item.grado;
      this.listarAreaById(item.id_Area);
      this.listarTipoMaterialById(item.id_TipoMaterial);
      this.listarDispositivoById(item.id_Dispositivos);
      this.listarEditorialById(item.id_Editorial);
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
       this.limpiar();
      this.editedIndex= -1;
    },
    closeEliminar() {
      this.dialogEliminar = false;
    },
    selectArea(value){
      this.areaSeleccionada= value;
    },
    selectTipoMaterial(value) {
      this.tipoMaterialSeleccionado = value;
    },
    selectDispositivo(value){
      this.dispositivoSeleccionado = value;
    },
    selectEditorial(value){
      this.editorialSeleccionada = value;
    }
  },
};
</script>
