describe('Bitso QA Challenge', () => {

  // Declare the constants mexMail, argMail and usrPwd and define their values 
  // from the environment variables (that could be provided using the command line)
  const mexMail = Cypress.env("mexMail");
  const argMail = Cypress.env("argMail");
  const usrPwd = Cypress.env("usrPwd");


	//
  it('Test - Creating a mexican and an argentinian user, checking cryptos and adding beneficiary', () => {

    // Creates the argentinian user for Bitso
    cy.createBitsoUser(argMail,usrPwd,"Argentina");
    // Creates the mexican user for Bitso
    cy.createBitsoUser(mexMail,usrPwd,"Mexico");

    // Login using the argentinian user, checks all the cryptos and adds a beneficiary
    cy.checkCryptoAndAddBeneficiary(argMail,usrPwd,"Carlos","Gardel","Argentino","01/01/2000");
    // Login using the mexican user, checks all the cryptos and adds a beneficiary
    cy.checkCryptoAndAddBeneficiary(mexMail,usrPwd,"Jose Alfredo","Jimenez","Mexicano","01/01/2000");

  })

  /* Command used for the bitso user creation. This command receives the following parameters:
    mail      - Mail for the new Bitso user
    pwd       - Password for the new Bitso user
    country   - Country for the new Bitso User
  */
  Cypress.Commands.add('createBitsoUser', (mail,pwd,country) => {
    // This segment of the code visits the register page in order to enter a valid country, email and password; 
    // then, after accepting all the terms, the registration form is submitted and it is necessary to ingress
    // manually the verification code sent to the provided email. Finally, the script waits for the
    // modal that includes the text "Let's get started", an evidence that the user could be created successfully   
    cy.visit("https://devmalta.bitso.com/register");
    cy.get("#language-select").type("English{enter}",{force:true});
    cy.get(".styles__Form-sc-1cll17m-4 > .styles__Wrapper-sc-6qm6qf-6 > .css-m0do4z > .css-16ljna5 > .css-tdzd0p").type(country+"{enter}");
    cy.get('#email').type(mail);
    cy.get('#password').type(pwd);
    cy.get('#password_confirmation').type(pwd);
    cy.get('#accept_terms').check({force: true});  
    cy.get('#accept_privacy').check({force: true}); 
    // If the country is Mexico, it is required to accept the NVIO Terms too.
    if (country == "Mexico") 
      cy.get('#accept_nvio_terms').check({force: true});  
    
    cy.get('form').submit();
    cy.get(".Modal__Title-oxabd1-4",{timeout:300000}).should("have.text","Let's get started")
    
    // The script closes the session in order to allow to execute the command createBitsoUser
    // without any issue regarding an active session on the webdriver
    cy.visit("https://devmalta.bitso.com/logout");

  })


  /* Command that checks all the cryptos and add a beneficiary for a user logged in. This command receives the following parameters:
    mail            - Mail for the new Bitso user
    pwd             - Password for the new Bitso user
    firstName       - First name for the beneficiary
    lastName        - Last name for the beneficiary
    secondLastName  - Seconds last name for the beneficiary
    dateOfBirth     - Date of birth for the beneficiary
    
  */
  Cypress.Commands.add('checkCryptoAndAddBeneficiary',(mail,pwd,firstName,lastName,secondLastName,dateOfBirth) => {
    // This segment of the code visits the main page, clicks the login link, enters the user login info,
    // closes the modal with the first login info and selects the english language
    cy.visit("https://devmalta.bitso.com/");
    cy.get(".bitso-hamburger-menu").click({force:true});
    cy.get(".LandingNavbar__LoginLink-sc-1qogmf-28 > span").click({force:true});
    cy.get("#client_id").type(mail);
    cy.get("#password").type(pwd);
    cy.get("form").submit();
    cy.get('.modal').type('{esc}'); 
    cy.get("#language-select").type("English{enter}",{force:true});
    
    
    // Before clicking all the cryptos and asserting the warning, it is necessary to confirm that 
    // the user knows the risk related with crypto currencies    
    cy.get(":nth-child(2) > .Container__StyledContainer-sc-1fkb9ns-0 > .styles__Name-go4zwh-1", { timeout: 10000 }).click({force:true});
    cy.get(".moon-arrow_deposit").click({force:true});
    cy.get("#riskAccepted").check({force:true})
    cy.get("[data-testid=crypto-risk-warning-button]").click({force:true})
    

    // This for loop clicks every crypto element on wallet page, then clicks the "Deposit" button and finally
    // asserts if the modal contains the expected text for the warning and sends an Escape key to close the modal
    let cryptoId = "";
    let i = 2;
    for ( i = 2 ; i <= 10 ; i++) {
      cryptoId = ":nth-child("+i+") > .Container__StyledContainer-sc-1fkb9ns-0 > .styles__Name-go4zwh-1"
      cy.get(cryptoId).click({force:true});
      cy.get(".moon-arrow_deposit").click({force:true});

      // For some reason, only the warning message for the last crypto (:nth-child(10) ) index includes 
      // a whitespace before the text "Increase my limit" so it's necessary to use a different text for the assertion
      if (i<10) 
        cy.get(".eJqlNJ > .Container__StyledContainer-sc-1fkb9ns-0").should('have.text',"Oops! Something went wrongThis transaction exceeds your limit. Increase your account limit to continue.Increase my limit")
      else 
        cy.get(".eJqlNJ > .Container__StyledContainer-sc-1fkb9ns-0").should('have.text',"Oops! Something went wrongThis transaction exceeds your limit. Increase your account limit to continue. Increase my limit")
    
      cy.get('.moon-alert').type('{esc}');
    }

    
    // This segment of the code visits the url for beneficiaries addition, enters all the required data
    // (first name, last name, second last name, date of birth, relationship and percentage)
    // and clicks the button to proceed with the beneficiary creation. 
    cy.visit("https://devmalta.bitso.com/r/user/beneficiaries/add");
    cy.get("#first_name").type(firstName);
    cy.get("#last_name").type(lastName);
    cy.get("#second_last_name").type(secondLastName);
    cy.get("#dob").type(dateOfBirth);
    cy.get("#relationship").click({force: true})
    cy.get("#relationship").type('{downarrow}',{force: true})
    cy.get("#relationship").type('{enter}',{force: true})
    cy.get("#percentage").type("100");
    cy.get("[data-testid=add-beneficiary-button]").click();
    /* ------------------------NOTE TO EVALUATOR--------------------------------- 
       I tried to complete the beneficiary addition but it is necesary to validate the account first to create a valid PIN.
       I also tried to automate the user validation but it requires sensitive data (that sometimes can be dummy) and a sms code sent
       to a valid and real phone number or sometimes the CURP wasn't available:
       "La verificación de CURP no está disponible temporalmente. Por favor intenta de nuevo en unas horas."  
       so, as far as I know, it should be done manually or find a way to keep polling that code from
       the valid phone number (or directly from DB) or maybe change a configuration to mock this validation, allowing in this way 
       that the beneficiary addition could be finished using a valid PIN.
    */

    // The script closes the session in order to allow to execute again the command checkCryptoAndAddBeneficiary
    // without any issue regarding an active session on the webdriver
    cy.visit("https://devmalta.bitso.com/logout");
  })
})
