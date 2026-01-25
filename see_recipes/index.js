import {ALL_FOOD_INFO_FILES, Ingredient} from "../models.js";

function loadAllrecipes() {
    const allMeals = document.getElementById("all-meals");
    allMeals.replaceChildren();

    const row = document.createElement("div");
    row.className = "row";
    allMeals.appendChild(row);

    ALL_FOOD_INFO_FILES.forEach(file => {
        fetch(`./../assets/food-info/${file}`)
            .then(response => response.json())
            .then(data => {
                const col = document.createElement("div");
                col.className = "col-sm-6 col-md-4";

                const card = document.createElement("div");
                card.className = "recipe-card";
                card.onclick = () => {
                    const params = new URLSearchParams(window.location.search); 
                    params.delete('name'); 
                    params.set('name', data.id);
                    window.location.href = `../recipe/index.html?`+ params.toString();
                };

                const img = document.createElement("img");
                img.src = `./../assets/food-img/${data.id}.png`;
                img.alt = data.name;
                img.className = "img-responsive";

                const title = document.createElement("h3");
                title.textContent = data.name;

                const hint = document.createElement("p");
                hint.textContent = "View recipe →";
                hint.className = "recipe-hint";

                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(hint);
                col.appendChild(card);
                row.appendChild(col);
            })
            .catch(() => {
                // silently fail if a recipe is missing assets
            });
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

loadAllrecipes();

document.getElementById("go-back-btn").addEventListener("click", goBackCookbook);
