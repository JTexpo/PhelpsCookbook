// List all the contents of the food-info directory
//todo: determine feasibility of automating this list's creation
export const ALL_FOOD_INFO_FILES = [
    "anabolic-french-toast.json",
    "california-breakfast-casserole.json",
    "cheesy-chicken-broccoli-n-rice.json",
    "chicken-n-rice-burrito-bowls.json",
    "cowboy-caviar.json",
    "crack-chicken-and-rice-casserole.json",
    "crock-pot-green-enchilada-chicken-soup.json",
    "easy-taco-soup.json",
    "eggroll-in-a-bowl.json",
    "grandma-shortys-jewish-coffee-cake.json",
    "grandmas-thanksgiving-dressing.json",
    "grandmoms-cucumber-sandwiches.json",
    "grandmoms-strawberry-cake.json",
    "great-great-grandma-barnes-rhubarb-pie.json",
    "great-great-uncle-charles-ginger-cookies.json",
    "honey-chicken.json",
    "mexican-street-corn-dip.json",
    "mexican-street-corn.json",
    "moms-measure-nothing-chili.json",
    "moms-mexican-casserole.json",
    "monterey-chicken.json",
    "no-waste-quiche.json",
    "poppy-seed-loaf-delight.json",
    "potato-salad.json",
    "pumpkin-sausage-soup.json",
    "sausage-n-bacon-grits-muffins.json",
    "sausage-balls.json",
    "southwest-quinoa-salad.json",
    "spinach-balls.json",
    "taco-salad.json",
    "tofu-stirfry.json",
    "tts-chicken-pot-pie-in-a-bowl.json",
    "tts-garden-spaghetti.json",
    "tts-turkey-chili.json",
    "vegan-chili.json",
    "zuchini-boats.json",
]

// Ingredient class
export class Ingredient {

    constructor(name, amount, unit) {
      this.name = name; // String
      this.amount = amount; // Number
      this.unit = unit; // String or null (no unit)

      // Some ingredients may be tough to convert (i.e., cloves of garlic)
      this.unitIsConvertible = Ingredient.#SUPPORTED_UNITS.has(unit); // Boolean
    }

    // Private mapping of supported units to the equivalent amount in the chosen base unit (tsp)
    static #SUPPORTED_UNITS = new Map([
        // todo: support unit aliases/ plurals better
        ["tsp", 1],
        ["tbsp", 3],
        ["level tbsp", 3],
        ["oz", 6],
        ["ounce", 6],
        ["ounces", 6],
        ["cup", 48], // 8oz
        ["cups", 48],
        ["cup shredded", 48],
        ["cups shredded", 48],
        ["pt", 96],  // 2 cups
        ["pts", 96],
        ["pint", 96],
        ["pints", 96],
        ["qt", 192], // 2 pts
        ["qts", 192],
        ["quart", 192],
        ["quarts", 192],
        ["gal", 768], // 4 qts
        ["gals", 768],
        ["gallon", 768],
        ["gallons", 768],
        ["lb", 96], // 16 oz
        ["lbs", 96],
        ["pound", 96],
        ["pounds", 96],
      ]);


    // Given Ingredient i, return the Number amount of the ingredient in the given
    // unit newUnit (String). If i is not convertible to newUnit, return null.
    static convertIngredientUnit(i, newUnit) {
        if ( ! (i.unitIsConvertible && Ingredient.#SUPPORTED_UNITS.has(newUnit))) {
            // Indicate that the unit cannot be converted
            return null;
        }
        // Get the amount in tsp
        const amountOldUnit = i.amount;
        const amountInTspOldUnit = Ingredient.#SUPPORTED_UNITS.get(i.unit);
        // Get the new unit tsp multiplier
        const amountInTspNewUnit = Ingredient.#SUPPORTED_UNITS.get(newUnit);
        // Convert the ingredient amount into the new unit
        return amountOldUnit * ( amountInTspOldUnit / amountInTspNewUnit );
    }

    // Given an Array of Ingredients, return a String representation of the cumulative sum
    // for each ingredient
    static sumOf(ingredientList) {
        // Keep track of each type of unit (some types are not convertible)
        // { name: { unit: amount, ... }, ... }
        var sumMap = new Map();
        for (let i = 0; i < ingredientList.length; i++)  {
            let ingredient = ingredientList[i];
            // Determine if we're already tracking this ingredient
            if (sumMap.has(ingredient.name)) {
                let iMap = sumMap.get(ingredient.name);
                // In case this is a non-convertible unit, try to accomodate plurality
                if (ingredient.unit != null) {
                    console.log("This ingredient is not null...");
                    let unit_str_trimmed = ingredient.unit.slice(0, -1);
                    let unit_str_plural = ingredient.unit + "s";
                    if (ingredient.unit.endsWith("s") && iMap.has(unit_str_trimmed)) {
                        // We're actually already tracking the singular version of this ingredient!
                        // Start tracking the plural
                        iMap.set(ingredient.unit, iMap.get(unit_str_trimmed));
                        iMap.delete(unit_str_trimmed);
                    } else if ((! ingredient.unit.endsWith("s")) && iMap.has(unit_str_plural)) {
                        // We're actually already tracking the plural version of this ingredient!
                        // Set this ingredient's unit to plural
                        ingredient.unit = unit_str_plural;
                    }
                }
                // Determine if we're already tracking this unit
                if (iMap.has(ingredient.unit)) {
                    iMap.set(ingredient.unit, iMap.get(ingredient.unit) + ingredient.amount);
                    sumMap.set(ingredient.name, iMap);
                    continue;
                }
                // Determine if this unit needs to be tracked separately from convertible units
                let converted = false;
                if (ingredient.unitIsConvertible) {
                    // We may be able to convert this amount to an existing unit we're already tracking..
                    const iMapKeys = [...iMap.keys()];
                    for (let ii = 0; ii < iMapKeys.length; ii++)  {
                        const summedUnit = iMapKeys[ii];
                        const currSummedAmount = iMap.get(summedUnit);
                        // See if conversion and summation is possible...
                        const convertedAmount = Ingredient.convertIngredientUnit(ingredient, summedUnit);
                        if (convertedAmount != null) {
                            // The conversion worked! Update the sum and break the inner loop
                            iMap.set(summedUnit, currSummedAmount + convertedAmount);
                            sumMap.set(ingredient.name, iMap);
                            converted = true;
                            break;
                        }
                        // Otherwise, keep trying other types in iMap..
                    }
                }
                if (! converted) {
                    // Start tracking this unit on its own
                    iMap.set(ingredient.unit, ingredient.amount);
                    sumMap.set(ingredient.name, iMap);
                }
            } else {
                // Add new ingredient to sumMap
                let iMap = new Map([ [ingredient.unit, ingredient.amount] ]);
                sumMap.set(ingredient.name, iMap);
            }
        }

        // Now that all of our incompatible units are mapped and individually summed per ingredient,
        // return the String representation of all units for all ingredients.
        // { name: "num unit, ...", ... }
        var sumStrMap = new Map();
        // Sort the keys alphabetically
        const sumMapKeys = [...sumMap.keys()];
        sumMapKeys.sort();
        for (let i = 0; i < sumMapKeys.length; i++)  {
            const ingredientName = sumMapKeys[i];
            const amountsMap = sumMap.get(ingredientName);
            var sumStr = "";
            amountsMap.forEach((summedAmount, summedUnit, amountsMap) => {
                // todo: print in a more logical way (i.e., convert to largest whole conversion, larger
                // weighted units- worth more tsp- first, etc.)
                sumStr += summedAmount;
                // Support unitless counts (represented with null unit)
                if (summedUnit != null) {
                    sumStr += " " + summedUnit;
                }
                sumStr += ", ";
            });
            if (sumStr.endsWith(", ")) {
                // Remove the last comma
                sumStr = sumStr.slice(0, -2);
            }
            sumStrMap.set(ingredientName, sumStr);
        }
        return sumStrMap;
    }
  
}
