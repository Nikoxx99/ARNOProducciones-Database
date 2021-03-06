import gqlt from 'graphql-tag'
export const state = () => ({
  neighborhoods: []
})
export const mutations = {
  getNeighborhoodsFromDatabase (state, neighborhoodList) {
    try {
      state.neighborhoods = neighborhoodList
    } catch (error) {
      throw new Error(`NEIGHBORHOOD MUTATE ${error}`)
    }
  }
}
export const actions = {
  async getNeighborhoodsFromDatabase ({ commit }) {
    try {
      const apollo = this.app.apolloProvider.defaultClient
      await apollo.query({
        query: gqlt`query{
          neighborhoods{
            id
            name
          }
        }
      `
      }).then((input) => {
        localStorage.setItem('neighborhoods', JSON.stringify(input.data.neighborhoods))
        commit('getNeighborhoodsFromDatabase', input.data.neighborhoods)
      })
    } catch (error) {
      throw new Error(`NEIGHBORHOOD ACTION ${error}`)
    }
  }
}
