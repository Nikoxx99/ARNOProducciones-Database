<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          color="cyan darken-4"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-plus</v-icon>
          <span v-if="block">
            Crear Avance
          </span>
        </v-btn>
      </template>
      <span>Crear Avance</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="590"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title class="headline">
          Crear Avance en Ticket de Traslado
        </v-card-title>
        <div v-if="!loading">
          <v-card-text>
            <h2> {{ name }} </h2>
            <p class="mt-2">Rellene la informacion especificando la ONU o NAP donde se genero la dx y que puerto queda libre.</p>
            <v-text-field
              v-model="dxInfo"
              outlined
              class="mt-2"
              label="Informacion de ONU/NAP desconexion"
            />
            <v-textarea
              v-model="ticketAdvance.details"
              outlined
              class="mt-2"
              label="Detalles adicionales"
            />
            <v-checkbox
              v-model="ticketAdvance.closeTicket"
              color="red"
              label="Cerrar Ticket de Traslado?"
            />
          </v-card-text>
        </div>
        <v-card-actions>
          <v-btn
            :color="ticketAdvance.closeTicket ? 'red darken-4' : 'blue darken-4'"
            @click="CreateTicketAdvance()"
          >
            {{ ticketAdvance.closeTicket ? 'Cerrar Ticket' : 'Crear Avance' }}
          </v-btn>
          <v-spacer />
          <v-btn
            text
            @click="modal = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snack"
      :timeout="1000"
      :color="snackColor"
      bottom
      vertical
    >
      {{ snackText }}

      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </span>
</template>

<script>
import gqlt from 'graphql-tag'
export default {
  name: 'CreateTicketAdvance',
  props: {
    editindex: {
      type: Number,
      default: -1
    },
    ticketid: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    modal: false,
    loading: false,
    snack: false,
    snackText: '',
    snackColor: '',
    dxInfo: '',
    cxInfo: '',
    ticketAdvance: {
      id: '',
      details: '',
      closeTicket: false,
      editindex: -1
    }
  }),
  methods: {
    initComponent () {
      this.modal = true
      this.ticketAdvance.id = this.ticketid
      this.ticketAdvance.editindex = this.editindex
    },
    CreateTicketAdvance () {
      this.$apollo.mutate({
        mutation: gqlt`mutation ($id: ID!, $status: Boolean){
          updateTicket(input: {
          where: {
            id: $id
          }
          data: {
            active: $status
          }
        }){
          ticket{
            id
          }
        }
        }`,
        variables: {
          id: this.ticketAdvance.id,
          status: !this.ticketAdvance.closeTicket
        }
      }).then(() => {
        this.$apollo.mutate({
          mutation: gqlt`mutation ($id: ID!, $details: String, $operator: ID!){
            createTicketdetail(input: {
              data: {
                ticket: $id
                details: $details
                operator: $operator
              }
            }) {
              ticketdetail{
                ticket{
                  id
                }
              }
            }
          }`,
          variables: {
            id: this.ticketAdvance.id,
            details: this.ticketAdvance.details + '\n' + this.dxInfo,
            operator: this.$store.state.auth.id
          }
        }).then((input) => {
          this.modal = false
          this.$emit('updateTicketStatus', this.ticketAdvance)
          this.snack = true
          this.snackColor = 'info'
          this.snackText = 'Ticket actualizado con éxito.'
        }).catch((error) => {
          this.snack = true
          this.snackColor = 'red'
          this.snackText = error
        })
      }).catch((error) => {
        this.snack = true
        this.snackColor = 'red'
        this.snackText = error
      })
    },
    can (component) {
      // eslint-disable-next-line camelcase
      const allowed_components = this.role
      // eslint-disable-next-line camelcase
      const current_component = component
      return allowed_components.includes(current_component)
    }
  }
}
</script>

<style>

</style>
