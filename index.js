import {ALL_FOOD_INFO_FILES, Ingredient} from "./models.js";
ALL_FOOD_INFO_FILES.sort();

const WEEKDAY_IDS = ["m", "t", "w", "th", "f", "s", "su"];
const MEALTYPE_IDS = ["b", "l", "d"];
const WEEKDAY_IDS_MAP = {
    "m": "monday",
    "t": "tuesday",
    "w": "wednesday",
    "th": "thursday",
    "f": "friday",
    "s": "saturday",
    "su": "sunday"
}
const MEALTYPE_IDS_MAP = {
    "b": "breakfast",
    "l": "lunch",
    "d": "dinner"
}

var WEEKDAY_MEALS = {}

/*
FUNCTIONS
*/

/**
 * Initializes the html for the weekly meals section.
 * 
 * This function clears the "weekly-meals" element and generates the
 * necessary html for the weekly meals section. This includes a header
 * for each weekday, a collapsible section for each weekday, and a list
 * for each meal of the day.
 * 
 * The function uses the WEEKDAY_IDS_MAP and MEALTYPE_IDS_MAP to generate
 * the necessary html. The WEEKDAY_IDS_MAP is used to generate the header
 * and collapsible section for each weekday, and the MEALTYPE_IDS_MAP is
 * used to generate the list for each meal of the day.
 */
function init_weekly_meals_html() {
  const weekly_meals_element = document.getElementById("weekly-meals");

  // Clear all existing children
  weekly_meals_element.replaceChildren();

  // ---- Header ----
  const headerRow = document.createElement("div");
  headerRow.className = "row";

  const headerCol = document.createElement("div");
  headerCol.className = "col-sm-12";

  const h2 = document.createElement("h2");
  h2.className = "text-center";
  h2.textContent = "Weekday Meals";

  headerCol.appendChild(h2);
  headerRow.appendChild(headerCol);
  weekly_meals_element.appendChild(headerRow);

  // ---- Weekdays ----
  Object.entries(WEEKDAY_IDS_MAP).forEach(([key, value]) => {
    // Collapsible button row
    const btnRow = document.createElement("div");
    btnRow.className = "row";

    const btnCol = document.createElement("div");
    btnCol.className = "col-sm-12";

    const btnInnerRow = document.createElement("div");
    btnInnerRow.className = "row";

    const btnInnerCol = document.createElement("div");
    btnInnerCol.className = "col-sm-12";

    const button = document.createElement("button");
    button.className = "collapsible";
    // button.id = `${value}-header`;
    button.textContent = value.toLocaleUpperCase();
    button.addEventListener("click", () => toggleCollapsibleElement(`${value}-content`));

    btnInnerCol.appendChild(button);
    btnInnerRow.appendChild(btnInnerCol);
    btnCol.appendChild(btnInnerRow);
    btnRow.appendChild(btnCol);
    weekly_meals_element.appendChild(btnRow);

    // Content row
    const contentRow = document.createElement("div");
    contentRow.className = "row";

    const contentCol = document.createElement("div");
    contentCol.className = "col-sm-12";

    const contentDiv = document.createElement("div");
    contentDiv.id = `${value}-content`;
    contentDiv.className = "content";

    // ---- Meal types ----
    MEALTYPE_IDS.forEach(mealtype => {
      // ---- Meal row title ----
      const mealRowTitle = document.createElement("div");
      mealRowTitle.className = "row";

      const mealTitleCol = document.createElement("div");
      mealTitleCol.className = "col-sm-12";

      const h4 = document.createElement("h4");
      h4.className = "text-left";
      h4.textContent = MEALTYPE_IDS_MAP[mealtype].toLocaleUpperCase();

      mealTitleCol.appendChild(h4);
      mealRowTitle.appendChild(mealTitleCol);

      // ---- Meal row list ----
      const mealRowList = document.createElement("div");
      mealRowList.className = "row";

      const mealListCol = document.createElement("div");
      mealListCol.className = "col-sm-12";

      const ul = document.createElement("ul");
      ul.id = `${key}_${mealtype}`;

      mealListCol.appendChild(ul);
      mealRowList.appendChild(mealListCol);

      contentDiv.appendChild(mealRowTitle);
      contentDiv.appendChild(mealRowList);
    });

    contentCol.appendChild(contentDiv);
    contentRow.appendChild(contentCol);
    weekly_meals_element.appendChild(contentRow);
  });
}


/**
 * Toggles the max-height of the element with the given id.
 * If the element has a max-height, it is set to null. Otherwise, it is set to the
 * element's scroll height.
 * @param {string} contentId - the id of the element to toggle
 */

/**
 * Toggles the max-height of the element with the given id.
 * If the element has a max-height, it is set to null. Otherwise, it is set to the
 * element's scroll height.
 * @param {string} elementId - the id of the element to toggle
 */
function toggleCollapsibleElement(elementId) {
    const element = document.getElementById(elementId);

    // If the element has a max-height, set it to null
    if (element.style.maxHeight) {
        element.style.maxHeight = '';
    }
    // Otherwise, set the max-height to the element's scroll height
    else {
        element.style.maxHeight = `${element.scrollHeight}px`;
    }
}

/**
 * Resets the maximum height of the element with the given id to its scroll height.
 * This function is used to set the maximum height of an element to its scroll height.
 * This is useful when the element's content has changed and the element's height needs to be updated.
 * @param {string} elementId - the id of the element to set the maximum height of
 */
function resetElementMaxHeight(elementId) {
    // Get the element with the given id
    const element = document.getElementById(elementId);
    
    // If the element has a maximum height, set it to its scroll height
    if (element.style.maxHeight) {
        // Set the maximum height of the element to its scroll height
        element.style.maxHeight = `${element.scrollHeight}px`;
    }
}

/**
 * Returns an object where the keys are in the format of "weekday-mealtype" and the
 * values are arrays of recipe names associated with the given weekday and meal
 * type.
 * 
 * The function takes a string parameter of the format "http://example.com?monday_breakfast=recipe1&monday_breakfast=recipe2&tuesday_lunch=recipe3"
 * and returns an object where the keys are in the format of "weekday-mealtype" and the
 * values are arrays of recipe names associated with the given weekday and meal
 * type.
 * 
 * @param {string} url_string - the url string to parse
 * @returns {Object} - an object where the keys are in the format of "weekday-mealtype" and the
 * values are arrays of recipe names associated with the given weekday and meal type.
 */
function getWeekdayMeals(url_string) {
    const url = new URL(url_string);

    var weekday_meals = {};
    WEEKDAY_IDS.forEach( weekday => {
        MEALTYPE_IDS.forEach( mealtype => {
            weekday_meals[weekday +"_"+ mealtype] = url.searchParams.getAll(weekday +"_"+ mealtype);
        })
    })

    return weekday_meals;
}

/**
 * Adds a recipe to the given meal.
 * 
 * The function takes a string parameter of the format "weekday-mealtype" and adds
 * the value of the input with the id "meal-add-recipe" to the array of recipes
 * associated with the given meal.
 * 
 * After adding the recipe, the function calls updateWeeklyMeals() to update the
 * HTML for the weekly meals section.
 * 
 * @param {string} meal - the id of the meal to add the recipe to
 */
function addRecipeToMeal(meal) {
    const recipe = document.getElementById(meal+"-add-recipe").value;
    WEEKDAY_MEALS[meal].push(recipe);
    updateWeeklyMeals(WEEKDAY_MEALS);
    updateIngredients(WEEKDAY_MEALS);
}

/**
 * Removes a recipe from the given meal.
 * 
 * The function takes a string parameter of the format "weekday-mealtype" and a recipe
 * name, and removes the recipe from the array of recipes associated with the
 * given meal.
 * 
 * After removing the recipe, the function calls updateWeeklyMeals() to update the
 * HTML for the weekly meals section.
 * 
 * @param {string} meal - the id of the meal to remove the recipe from
 * @param {string} recipe - the name of the recipe to remove
 */
function removeRecipeFromMeal(meal, recipe) {
    WEEKDAY_MEALS[meal].splice(WEEKDAY_MEALS[meal].indexOf(recipe), 1);
    updateWeeklyMeals(WEEKDAY_MEALS);
    updateIngredients(WEEKDAY_MEALS);
}

/**
 * Updates the HTML for the weekly meals section based on the given object.
 * 
 * The function takes an object where the keys are in the format of
 * "weekday-mealtype" and the values are arrays of recipe names.
 * 
 * The function iterates through the object and generates the necessary HTML
 * for each weekday and meal type. It also adds a list of recipes for each
 * meal type, if the meal type has recipes.
 * 
 * @param {Object} weeklyMeals - an object where the keys are in the format of
 * "weekday-mealtype" and the values are arrays of recipe names.
 */
function updateWeeklyMeals(weeklyMeals) {
    /**
     * Sanitizes the weekly meals object by removing any meal types that are
     * undefined or null.
     */
    const sanitizedWeeklyMeals = Object.fromEntries(
        Object.entries(weeklyMeals).map(([key, meals]) => [
            key,
            meals.filter(meal => meal !== undefined && meal !== null)
        ])
    );

    /**
     * Iterates through the sanitized weekly meals object and generates the necessary
     * HTML for each weekday and meal type.
     */
    Object.entries(sanitizedWeeklyMeals).forEach(([key, meals]) => {
        const mealElement = document.getElementById(key);
        mealElement.replaceChildren();
        /**
         * Creates a form for adding new recipes to the meal type.
         */
        const inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");
        inputGroup.classList.add("mb-3");

        /**
         * Creates a select element for adding new recipes to the meal type.
         */
        const addRecipeForm = document.createElement("form");
        const select = document.createElement("select");
        select.classList.add("custom-select");
        select.id = `${key}-add-recipe`;
        ALL_FOOD_INFO_FILES.forEach(filename => {
            const option = document.createElement("option");
            option.textContent = filename.split(".")[0].replaceAll("-", " ").toLowerCase();
            select.appendChild(option);
        });

        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.classList.add("btn");
        addButton.classList.add("btn-block");
        addButton.classList.add("btn-success");
        addButton.addEventListener("click", event => {
            event.preventDefault();
            addRecipeToMeal(key);
        });

        const inputGroupPrepend = document.createElement("div");
        inputGroupPrepend.classList.add("input-group-prepend");
        inputGroupPrepend.appendChild(addButton)

        inputGroup.appendChild(inputGroupPrepend);
        inputGroup.appendChild(select);
        addRecipeForm.appendChild(inputGroup);

        mealElement.appendChild(addRecipeForm);

        /**
         * If the meal type has any recipes, creates a list of recipes.
         */
        if (meals.length > 0) {
            const recipeList = document.createElement("ul");
            meals.forEach(meal => {
                fetch(`./assets/food-info/${meal.replaceAll(" ", "-")}.json`)
                    .then(response => response.json())
                    .then(data => {
                        const recipeListItem = document.createElement("div");
                        recipeListItem.className = "row";
                        const recipeCol = document.createElement("div");
                        recipeCol.className = "col-sm-6";
                        recipeCol.textContent = data.name;
                        recipeListItem.appendChild(recipeCol);

                        // recipeListItem.textContent = data.id;

                        const infoButton = document.createElement("button");
                        infoButton.textContent = "Info";
                        infoButton.classList.add("btn");
                        infoButton.classList.add("btn-block");
                        infoButton.addEventListener("click", () => {
                            const share_url = getShareLink();
                            const params = new URLSearchParams(share_url.searchParams); 
                            params.delete('name'); 
                            params.set('name', data.id);
                            window.location.href = `./recipe/index.html?`+ params.toString();

                                                });

                        const removeButton = document.createElement("button");
                        removeButton.textContent = "Remove";
                        removeButton.classList.add("btn");
                        removeButton.classList.add("btn-block");
                        removeButton.classList.add("btn-danger");
                        removeButton.addEventListener("click", event => {
                            event.preventDefault();
                            removeRecipeFromMeal(key, meal);
                        });

                        const infoButtonColumn = document.createElement("div");
                        infoButtonColumn.className = "col-sm-3";
                        infoButtonColumn.appendChild(infoButton);
                        recipeListItem.appendChild(infoButtonColumn);
                        const removeButtonColumn = document.createElement("div");
                        removeButtonColumn.className = "col-sm-3";
                        removeButtonColumn.appendChild(removeButton);
                        recipeListItem.appendChild(removeButtonColumn);

                        recipeList.appendChild(recipeListItem);
                    })
                    .then(() => {
                        resetElementMaxHeight(WEEKDAY_IDS_MAP[key.split("_")[0]]+"-content");
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },
        );
            mealElement.appendChild(recipeList);
        }
    });
}

function updateIngredients(weeklyMeals){
    /**
     * Sanitizes the weekly meals object by removing any meal types that are
     * undefined or null.
     */
    const sanitizedWeeklyMeals = Object.fromEntries(
        Object.entries(weeklyMeals).map(([key, meals]) => [
            key,
            meals.filter(meal => meal !== undefined && meal !== null)
        ])
    );

    // HTML: <ul> <ul> <li> marker "Name (sumStr)"</li>... </ul> </ul>
    const ingredients = document.getElementById("ingredients");
    ingredients.replaceChildren();
    let seenIngredients = [];
    Object.entries(sanitizedWeeklyMeals).forEach(([key, meals]) => {
        meals.forEach(meal => {
            fetch(`./assets/food-info/${meal.replaceAll(" ", "-")}.json`)
                .then(response => response.json())
                .then(data => {
                    // ingredients: Map of Names to Array [ Amount, Unit, ... ]
                    Object.entries(data.ingredients).forEach(([name, amountList]) => {
                        // Support ingredient lists that provide multiple amounts in different units
                        for (var i = 0; i + 1 < amountList.length; i += 2) {
                            // Create an Ingredient object from the JSON map
                            const amount = amountList[i];
                            const unit = amountList[i + 1];
                            seenIngredients.push(new Ingredient(name, amount, unit));
                        }
                    });

                    // Get a Map of ingredient Names to prepared String with summed amounts/ units
                    const sumMap = Ingredient.sumOf(seenIngredients);
                    // Generate the HTML list of all ingredients and add to the site
                    const ingredientList = document.createElement("ul");
                    sumMap.forEach((count, ingredient, sumMap) => {
                        const ingredientListItem = document.createElement("li");
                        ingredientListItem.textContent = `${ingredient} (${count})`;
                        ingredientList.appendChild(ingredientListItem);
                    });
                    ingredients.innerHTML = "";
                    ingredients.appendChild(ingredientList);
                })
                .catch(error => {
                    console.error(error);
                });
        });
    });
}

/**
 * Shows a toast message on the screen for a short amount of time.
 * The message is displayed for 2 seconds, then fades out over 0.3 seconds.
 * @param {string} message - the message to display on the toast
 */
function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = "toast";

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

/**
 * Returns a URL object that represents a shareable link for the current
 * selection of weekly meals. The link contains all the weekly meal selections
 * as query parameters.
 *
 * @returns {URL} - a URL object representing the shareable link
 */
function getShareLink() {
    var url = new URL(window.location.href);
    var url = new URL(url.origin + url.pathname);

    for (const [key, value] of Object.entries(WEEKDAY_MEALS)) {
        for (var i = 0; i < value.length; i++) {
            url.searchParams.append(key, value[i]);
        }
    }
    return url;   
}

/**
 * Copies the current share link to the clipboard.
 * @returns {Promise<void>} A promise that resolves when the link has been copied, or rejects with an error.
 */
function copySharelink() {
    const url = getShareLink();
    navigator.clipboard.writeText(url.href)
        .then(() => showToast("Link copied to clipboard 📋"))
        .catch(err => console.error(err));
}

/**
 * Redirects to the recipe page with the current weekly meals as parameters
 */
function seeRecipePage() {
    const share_url = getShareLink();
    const params = new URLSearchParams(share_url.searchParams); 
    params.delete('name'); 
    window.location.href = 'see_recipes/index.html?' + params.toString();
}


/*
MAIN
*/

init_weekly_meals_html();

WEEKDAY_MEALS = getWeekdayMeals(window.location.href);
console.log(WEEKDAY_MEALS);
updateWeeklyMeals(WEEKDAY_MEALS);
updateIngredients(WEEKDAY_MEALS);

document.getElementById("share-btn").addEventListener("click", copySharelink);
document.getElementById("recipe-btn").addEventListener("click", seeRecipePage);
