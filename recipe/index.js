
const params = new URLSearchParams(window.location.search);
const recipeNameParam = params.get("name");

/**
 * Loads a recipe given its name from the food-info directory.
 * @param {string} name The name of the recipe to load.
 */
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
            // ingredients: Map of Names to Array [ Amount, Unit, ... ]
            Object.entries(data.ingredients).forEach(([item, amountList]) => {
                // Support ingredient lists that provide multiple amounts in different units
                let countStr = " (";
                for (var i = 0; i < amountList.length; i += 2) {
                    const amount = amountList[i];
                    // Support unitless counts
                    countStr += amount;
                    if (i + 1 < amountList.length) {
                        const unit = amountList[i + 1];
                        countStr += " " + unit;
                        if (i + 2 < amountList.length) {
                            // Expecting another amount
                            countStr += ", ";
                        }
                    }
                }
                countStr += ")";
                // Append the amounts/ units in parentheses after the item
                const li = document.createElement("li");
                li.textContent = item + countStr;
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

//todo: define in shared location
function goBackCookbook() {
    const params = new URLSearchParams(window.location.search); 
    params.delete('name'); 
    window.location.href = '../index.html?' + params.toString();
}


/*
MAIN
*/

if (recipeNameParam) {
    loadRecipe(recipeNameParam);
}

document.getElementById("go-back-btn").addEventListener("click", goBackCookbook);
