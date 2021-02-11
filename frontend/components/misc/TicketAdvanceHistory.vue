<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          color="blue darken-4"
          v-on="on"
          @click="initComponent()"
        >
          mdi-server
        </v-icon>
      </template>
      <span>Historial de Avances</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="990"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title class="headline">
          Historial de Avances
        </v-card-title>
        <div v-if="!loading">
          <v-card-text>
            <h2> {{ name }} </h2>
            <v-data-table
              :headers="headers"
              :items="ticketdetails"
              :items-per-page="10"
              no-data-text="No hay avances para mostrar aun..."
              loading-text="Cargando información de tickets..."
            />
          </v-card-text>
        </div>
        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green darken-1"
            text
            @click="modal = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'TicketAdvanceHistory',
  apollo: {
    ticketdetails () {
      return {
        query: gql`
          query($id: ID!){
            ticketdetails(where: {
              ticket: $id
            }){
              ticket{
                client{
                  name
                }
                tickettype{
                  name
                }
                createdAt
                assiganted {
                  username
                }
              }
              details
            }
          }
        `,
        variables: {
          id: this.ticketid
        },
        skip () {
          return true
        }
      }
    }
  },
  props: {
    ticketid: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    modal: false,
    loading: true,
    snack: false,
    snackText: '',
    snackColor: '',
    ticketdetails: [],
    headers: [
      { text: 'Cliente', sortable: true, value: 'ticket.client.name' },
      { text: 'Tipo', sortable: true, value: 'ticket.tickettype.name' },
      { text: 'Operador', sortable: false, value: 'ticket.assiganted.username' },
      { text: 'Detalles', sortable: true, value: 'details' },
      { text: 'Creado', sortable: true, value: 'ticket.createdAt' }
    ]
  }),
  methods: {
    async initComponent () {
      this.modal = true
      this.loading = false
      this.$apollo.queries.ticketdetails.skip = false
      await this.$apollo.queries.ticketdetails.fetchMore({
        variables: {
          id: this.ticketid
        },
        updateQuery: (_, { fetchMoreResult }) => {
          const newInfo = fetchMoreResult.ticketdetails
          this.ticketdetails = newInfo
        }
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