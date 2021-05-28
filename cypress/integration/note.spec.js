describe('Note Capture', () => {
    before(() => {
        cy.visit('/');
    });

    it('should have header', () => {
        cy.get('[data-testid=note-header]').should('have.text', 'My Notes App')
    })
    
    it('should create a note when name and description provided', () => {
        //cy.get('[data-testid=test-name-0]').should('not.exist');
        //cy.get('[data-testid=test-description-0]').should('not.exist');
        
        cy.get('[data-testid=note-name-field]').type('test note');
        cy.get('[data-testid=note-description-field]').type('test note description');
        cy.get('[data-testid=note-form-submit]').click();

        // cy.get('[data-testid=note-name-field]').should('have.value', '');
        // cy.get('[data-testid=note-description-field]').should('have.value', '');

        cy.get('[data-testid=test-name-0]').should('have.text', 'test note');
        cy.get('[data-testid=test-description-0]').should('have.text', 'test note description');
    });

    it('should delete note', () => {
        cy.get('[data-testid=test-button-0]').click();

        // cy.get('[data-testid=test-name-0]').should('not.exist')
        // cy.get('[data-testid=test-description-0]').should('not.exist')
    })
});