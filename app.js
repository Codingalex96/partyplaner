const COHORT = "2407-FTB-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    parties: [],
  };
  
  const partiesList = document.querySelector('#parties');
  const addPartyForm = document.querySelector('#addParty');
  addPartyForm.addEventListener('submit', addParty);
  
  /**
   * Sync state with the API and rerender
   */
  async function render() {
    await getParties();
    renderParties();
  }
  render();
  
  /**
   * Update state with parties from API
   */
  async function getParties() {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      state.parties = json.data; // Assumes API returns { data: [ ...parties ] }
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  }
  
  /**
   * Handle form submission for adding a party
   * @param {Event} event
   */
  async function addParty(event) {
    event.preventDefault();
    
    const formData = new FormData(addPartyForm);
    const newParty = {
      name: formData.get('name'),
      date: formData.get('date'),
      location: formData.get('location'),
      description: formData.get('description'),
    };
  
    await createParty(newParty);
  }
  
  /**
   * Ask API to create a new party and rerender
   * @param {object} party Party object with name, date, location, description
   */
  async function createParty(party) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(party),
      });
      await response.json();
      render();
    } catch (error) {
      console.error('Error creating party:', error);
    }
  }
  
  /**
   * Ask API to delete a party and rerender
   * @param {number} id ID of party to delete
   */
  async function deleteParty(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      await response.json();
      render();
    } catch (error) {
      console.error('Error deleting party:', error);
    }
  }
  
  /**
   * Render parties from state
   */
  function renderParties() {
    if (!state.parties.length) {
      partiesList.innerHTML = '<li>No parties found.</li>';
      return;
    }
  
    const partyCards = state.parties.map((party) => {
      const partyCard = document.createElement('li');
      partyCard.classList.add('party');
      partyCard.innerHTML = `
        <h2>${party.name}</h2>
        <p>Date: ${party.date}</p>
        <p>Location: ${party.location}</p>
        <p>${party.description}</p>
      `;
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete Party';
      deleteButton.addEventListener('click', () => deleteParty(party.id));
  
      partyCard.append(deleteButton);
      return partyCard;
    });
  
    partiesList.replaceChildren(...partyCards);
  }