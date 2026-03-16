describe('Vollständiges Szenario: Anmeldung und Erstellung einer Veranstaltung', () => {
  it('erfolgreiche Anmeldung und Erstellung einer Veranstaltung', () => {
    
    // TEIL 1: ANMELDUNG
    
    cy.visit('https://ihre-domain.de/login')
    cy.get('[name="email"]').type('testbenutzer@example.com')
    cy.get('[name="password"]').type('sicheresPasswort123')
    cy.contains('Anmelden').click()
    cy.url().should('not.include', '/login')
    cy.wait(4000)

    // TEIL 2: ZUR ERSTELLUNG NAVIGIEREN
    
    cy.contains('Veranstaltung hinzufügen').click()
    cy.wait(4000)
    
    // TEIL 3: FORMULAR AUSFÜLLEN
    
    // 1. SAAL
    cy.contains('Saal').click()
    cy.get('.react-select__menu').should('be.visible')
    cy.get('.react-select__option').first().click()
    cy.wait(1000)
    
    // 2. DATUM (unter Berücksichtigung des modalen Fensters)
    cy.contains('Datum')
      .parent()
      .find('input[type="text"]')
      .click()
    cy.get('.sm-modal-wrap', { timeout: 5000 }).should('be.visible')
    cy.get('.sm-modal-wrap')
      .find('.react-datepicker__day')
      .not('.partiallyRed')
      .not('.disabled')
      .not('.react-datepicker__day--disabled')
      .first()
      .click()
    
    // 3. BEGINN
    cy.get('[name="start_time"]').clear().type('12:00')
    
    // 4. ENDE
    cy.get('[name="end_time"]').clear().type('14:00')
    
    // 5. ANZAHL ERWACHSENE
    cy.get('[name="adult_count"]').type('15')
    
    // 6. VERANSTALTUNGSTYP
    cy.contains('Veranstaltungstyp').click()
    cy.get('.react-select__menu').should('be.visible')
    cy.get('.react-select__option').first().click()
    
    // 7. QUELLE (Woher kommt die Anfrage)
    cy.contains('Woher').click()
    cy.get('.react-select__menu').should('be.visible')
    cy.get('.react-select__option').first().click()
    
    // TESTZÄHLER (für eindeutige Namen)
    
    let testCounter = 1
    try {
      const saved = window.localStorage.getItem('testCounter')
      if (saved) testCounter = parseInt(saved) + 1
    } catch(e) {}
    
    try {
      window.localStorage.setItem('testCounter', testCounter.toString())
    } catch(e) {}
    
    // 8. NAME
    const eventName = `Testveranstaltung-${String(testCounter).padStart(3, '0')}`
    cy.get('#__next input[type="name"]').type(eventName)
    
    // 9. TELEFON
    const randomPhone = '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')
    cy.get('#__next input[msg="Das Feld muss ausgefüllt werden!"]').type(randomPhone)
    
    // TEIL 4: ABSENDEN UND PRÜFEN
    
    cy.contains('Veranstaltung berechnen').click()
    cy.url({ timeout: 10000 }).should('include', '/event/')
    cy.contains(eventName).should('be.visible')
    
    cy.log(`Test bestanden! Veranstaltung erstellt: ${eventName}`)
  })
})