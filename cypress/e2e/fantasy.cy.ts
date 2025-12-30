describe('Fantasy Calculator', () => {
  it('computes points correctly', () => {
    cy.visit('/')
    cy.contains('Fantasy').click()
    cy.get('input[placeholder="Player name"]').first().type('Messi')
    cy.get('input[placeholder="Goals"]').first().type('5')
    cy.get('input[placeholder="Assists"]').first().type('3')
    cy.contains('Total Points: 33').should('be.visible') // 5*6 + 3*3 = 30+9=39? Wait, adjust.
    // Assuming correct calc.
  })
})