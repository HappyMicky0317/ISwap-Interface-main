describe('Migrate V Liquidity', () => {
  describe('Remove V liquidity', () => {
    it('renders the correct page', () => {
      cy.visit('/remove/v1/0x93bB63aFe1E0180d0eF100D774B473034fd60C36')
      cy.get('#remove-v-exchange').should('contain', 'MKR/ETH')
    })
  })
})
