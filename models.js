// List all the contents of the food-info directory
//todo: determine feasibility of automating this list's creation
export const ALL_FOOD_INFO_FILES = [
    "vegan-chili.json",
    "no-waste-quiche.json",
    "tofu-stirfry.json",
    "chicken-n-rice-burrito-bowls.json",
    "sausage-balls.json",
    "eggroll-in-a-bowl.json",
    "cheesy-chicken-broccoli-n-rice.json",
]
ALL_FOOD_INFO_FILES.sort();

// Ingredient class
export class Ingredient {

    constructor(name, amount, unit) {
      this.name = name; // String
      this.amount = amount; // Number
      this.unit = unit; // String

      // Some ingredients may be tough to convert (i.e., cloves of garlic)
      this.unitIsConvertible = Ingredient.#SUPPORTED_UNITS.has(unit); // Boolean
    }

    // Private mapping of supported units to the equivalent amount in the chosen base unit (tsp)
    static #SUPPORTED_UNITS = new Map([
        // todo: support unit aliases/ plurals better
        ["tsp", 1],
        ["tbsp", 3],
        ["oz", 6],
        ["ounce", 6],
        ["ounces", 6],
        ["cup", 48], // 8oz
        ["cups", 48],
        //["can", 48], // assume 8oz can?
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


    // Given Ingredient i, return the Number amount of i in the given
    // unit newUnit (String). If i is not convertible to newUnit, return null.
    static convertIngredientUnit(i, newUnit) {
        if ( ! (i.unitIsConvertible && Ingredient.#SUPPORTED_UNITS.has(newUnit))) {
            // Indicate that the unit cannot be converted
            return null;
        }
        // Get the amount in tsp
        baseAmount = i.amount * Ingredient.#SUPPORTED_UNITS.get(i.unit);
        // Multiply the base amount by the tsp multiplier for newUnit
        return baseAmount * Ingredient.#SUPPORTED_UNITS.get(newUnit);
    }

    // Given an Array of Ingredients, return a String representation of the cumulative sum
    static sumOf(ingredientList) {
        // Keep track of each type of unit (some types are not convertible)
        // { unit: amount, ... }
        const sumMap = new Map();
        for (const i in ingredientList) {
            // Determine if we're already tracking this ingredient unit
            if (sumMap.has(i.unit)) {
                sumMap.set(i.unit, sumMap.get(i.unit) + i.amount);
                continue;
            }
            // Determine if this unit needs to be tracked separately from convertible units
            converted = false;
            if (i.unitIsConvertible) {
                // We may be able to convert this amount to an existing unit we're already tracking..
                for (const summedUnit in sumMap.keys()) {
                    convertedAmount = Ingredient.convertIngredientUnit(i, summedUnit);
                    if (convertedAmount != null) {
                        // The conversion worked! Update the sum and break the inner loop
                        sumMap.set(summedUnit, sumMap.get(summedUnit) + convertedAmount);
                        converted = true;
                        break;
                    }
                    // Otherwise, keep trying other types in symMap..
                }
            }
            if (! converted) {
                // Start tracking this unit on its own
                sumMap.set(i.unit, i.amount);
            }
        }

        // Now that all of our incompatible units are mapped and individually summed,
        // return the String representation of all units.
        sumStr = "";
        for (const summedUnit in sumMap.keys()) {
            // todo: print in a more logical way (i.e., larger weighted units- worth more tsp- first)
            sumStr += sumMap.get(summedUnit) + " " + summedUnit + ",";
        }
        if (sumStr.endsWith(",")) {
            // Remove the last comma
            sumStr = sumStr.slice(0, -1);
        }
        return sumStr;
    }

    //todo: equality operator
  
}
