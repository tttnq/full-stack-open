describe('Blog app', function () {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Tero Testi',
      username: 'testaaja',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testaaja')
      cy.get('#password').type('salainen')
      cy.contains('login').click()
      cy.contains('Tero Testi logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('uusiKayttaja')
      cy.get('#password').type('salainen')
      cy.contains('login').click()
      cy.get('.notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })

  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testaaja', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Author A')
      cy.get('#url').type('http://localhost:3000')

      cy.get('#create-btn').click()
      cy.contains('Test Title Author A')
    })

    describe('and a blog exists', function () {
      beforeEach(function() {
        cy.createBlog({ title: 'First', author: 'Author A', url: 'http://testA.fi', likes: 10 })
        cy.createBlog({ title: 'Second', author: 'Author B', url: 'http://testB.fi', likes: 9 })
        cy.createBlog({ title: 'Third', author: 'Author C', url: 'http://testC.fi', likes: 8 })
        cy.createBlog({ title: 'Most Liked', author: 'Famous', url: 'http://fame.fi', likes: 11 })
      })

      it('A blog can be liked', function() {
        cy.contains('First').contains('view').click()
        cy.contains('likes 10')
        cy.contains('like').click()
        cy.contains('likes 11')
        cy.contains('like').click()
        cy.contains('likes 12')
      })

      it('A blog can be deleted', function() {
        cy.contains('First').contains('view').click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'First')
      })

      it('Blogs were sorted by number of likes', function() {
        cy.get('.blog').then(blog => {
          cy.wrap(blog[0]).contains('Most Liked Famous')
          cy.wrap(blog[1]).contains('First Author A')
          cy.wrap(blog[2]).contains('Second Author B')
          cy.wrap(blog[3]).contains('Third Author C')
        })
      })
    })

  })

})
