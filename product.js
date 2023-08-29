async function initialize() {
  let baseUrl = "products.json";
  let items;
  try {
    let response = await fetch(baseUrl);
    items = await response.json();
    console.log(items);
  } catch (error) {
    console.log(error);
  }

  // caching the dom

  let category = document.querySelector("#category");
  let searchTerm = document.querySelector("#searchTerm");
  let searchBtn = document.querySelector("button");
  let main = document.querySelector("main");

  let lastCategory = category.value;
  // no search has been made
  let lastSearch = "";

  let categoryGroup;
  let finalGroup;

  // this happens initially
  finalGroup = items;
  updateDisplay();

  categoryGroup = [];
  finalGroup = [];

  searchBtn.addEventListener("click", selectCategory);

  function selectCategory(e) {
    e.preventDefault();
    // set the category group and final group to empty.
    categoryGroup = [];
    finalGroup = [];

    if (
      category.value === lastCategory &&
      searchTerm.value.trim() === lastSearch
    ) {
      return;
    } else {
      // update teh record of last category and search term

      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      if (category.value === "All") {
        categoryGroup = items;
        selectProducts();
      } else {
        let lowerCaseType = category.value.toLowerCase();
        categoryGroup = items.filter((product) => {
          return product.type === lowerCaseType;
        });
        selectProducts();
      }
    }
  }

  function selectProducts() {
    if (searchTerm.value.trim() === "") {
      finalGroup = categoryGroup;
    } else {
      let lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      finalGroup = categoryGroup.filter((product) => {
        return product.name.includes(lowerCaseSearchTerm);
      });
    }
    updateDisplay();
  }

  function updateDisplay() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    if (finalGroup.length === 0) {
      let para = document.createElement("p");
      para.textContent = "No results to display.";
      main.appendChild(para);
    } else {
      for (let product of finalGroup) {
        fetchBlob(product);
      }
    }
  }

  async function fetchBlob(product) {
    let url = `PHOTOS/${product.image}`;
    try {
      let response = await fetch(url);
      let responseBlob = await response.blob();
      showProduct(responseBlob, product);
    } catch (error) {
      console.log(error);
    }
  }

  function showProduct(blob, product) {
    let objectURL = URL.createObjectURL(blob);
    let section = document.createElement("section");
    let heading = document.createElement("h2");
    let para = document.createElement("p");
    let image = document.createElement("img");

    section.setAttribute("class", product.type);

    heading.textContent = product.name.replace(
      product.name.charAt(0),
      product.name.charAt(0).toUpperCase()
    );

    para.textContent = `$${product.price.toFixed(2)}`;

    image.src = objectURL;
    image.alt = product.name;

    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
  }
}
initialize();
