
const params = new URLSearchParams(window.location.search);
const recipeNameParam = params.get("name");

function loadRecipe(name) {
    fetch(`./../assets/food-info/${name}.json`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("recipe-name").textContent = data.name;

            const image = document.getElementById("recipe-image");
            image.src = `./../assets/food-img/${data.id}.png`;
            image.alt = data.name;

            const author = document.getElementById("author");
            author.textContent = `Author: ${data.author}`;

            const ingredientsList = document.getElementById("ingredients-list");
            ingredientsList.replaceChildren();
            data.ingredients.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                ingredientsList.appendChild(li);
            });

            const stepsList = document.getElementById("steps-list");
            stepsList.replaceChildren();
            data.steps.forEach(step => {
                const li = document.createElement("li");
                li.textContent = step;
                stepsList.appendChild(li);
            });
        })
        .catch(() => {
            document.getElementById("recipe-name").textContent =
                "Recipe not found";
        });
}

if (recipeNameParam) {
    loadRecipe(recipeNameParam);
}