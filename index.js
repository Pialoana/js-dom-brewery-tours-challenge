// Define initial state
let state = {
  selectedState: "",
  filteredType: "",
};

// Function to fetch brewery data based on the selected state
async function fetchBreweriesByState(state) {
  const response = await fetch(
    `https://api.openbrewerydb.org/breweries?by_state=${state}`
  );
  const data = await response.json();
  return data;
}

// Function to render the breweries list
function renderBreweries(breweries) {
  const breweriesList = document.getElementById("breweries-list");
  breweriesList.innerHTML = ""; // Clear previous list

  breweries.forEach((brewery) => {
    // Only add breweries of type micro, regional, or brewpub
    if (["micro", "regional", "brewpub"].includes(brewery.brewery_type)) {
      const li = document.createElement("li");
      li.innerHTML = `
        <h2>${brewery.name}</h2>
        <div class="type">${brewery.brewery_type}</div>
        <section class="address">
          <h3>Address:</h3>
          <p>${brewery.street}</p>
          <p><strong>${brewery.city}, ${brewery.postal_code}</strong></p>
        </section>
        <section class="phone">
          <h3>Phone:</h3>
          <p>${brewery.phone || "N/A"}</p>
        </section>
        <section class="link">
          <a href="${
            brewery.website_url || "#"
          }" target="_blank">Visit Website</a>
        </section>
      `;
      breweriesList.appendChild(li);
    }
  });
}

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const selectedState = formData.get("select-state");

  // Update state
  state.selectedState = selectedState;

  // Fetch breweries based on the selected state
  fetchBreweriesByState(selectedState)
    .then((data) => {
      console.log(data); // Log the response to understand the data structure
      renderBreweries(data);
    })
    .catch((error) => console.error("Error fetching breweries:", error));
}

// Function to handle type filter change
function handleTypeFilterChange(event) {
  const selectedType = event.target.value;

  // Update state
  state.filteredType = selectedType;

  // Refetch and rerender the breweries list with the new filter
  fetchBreweriesByState(state.selectedState)
    .then((data) => {
      const filteredBreweries = data.filter(
        (brewery) => brewery.brewery_type === selectedType
      );
      renderBreweries(filteredBreweries);
    })
    .catch((error) => console.error("Error fetching breweries:", error));
}

// Event listeners
document
  .getElementById("select-state-form")
  .addEventListener("submit", handleSubmit);
document
  .getElementById("filter-by-type")
  .addEventListener("change", handleTypeFilterChange);

// Initial render
renderBreweries([]);
