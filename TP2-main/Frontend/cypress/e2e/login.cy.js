describe('Frontend login flow', () => {
  it('renders login, authenticates, and navigates to the portal', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          id: 'user-1',
          name: 'Juan Pérez',
          email: 'juan.perez@example.com',
          role: 'docente',
        },
      },
    }).as('loginRequest');

    cy.intercept('GET', '/api/portal', {
      statusCode: 200,
      body: {
        student: { name: 'Juan Pérez', code: '2025-A', section: 'A1' },
        teacher: { name: 'Juan Pérez', availability: Array.from({ length: 5 }, () => Array(12).fill(1)) },
        courses: [],
        sessionList: [],
        enrolledCourses: [],
        availableCourses: [],
        personalGrid: {},
        hasSchedule: false,
        totalBlocks: 0,
      },
    }).as('portalData');

    cy.visit('/login');
    cy.contains('Acceso al sistema').should('be.visible');

    cy.get('input[type=email]').type('juan.perez@example.com');
    cy.get('input[type=password]').type('Password123!');
    cy.contains('button', 'Entrar').click();

    cy.wait('@loginRequest');
    cy.wait('@portalData');

    cy.url().should('include', '/portal');
    cy.contains('Portal del Docente').should('be.visible');
    cy.contains('Cursos').should('be.visible');
  });
});
