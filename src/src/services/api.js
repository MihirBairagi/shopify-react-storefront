const API_URL = "http://localhost:5000/api";


// Get homepage data

export const getPageData = async () => {

  const response = await fetch(
    `${API_URL}/page`
  );

  if (!response.ok) {

    throw new Error(
      "Failed to fetch page data"
    );

  }

  return response.json();

};


// Save homepage data

export const savePageData = async (pageData) => {

  const response = await fetch(
    `${API_URL}/page`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(pageData)
    }
  );


  if (!response.ok) {

    throw new Error(
      "Failed to save page data"
    );

  }


  return response.json();

};