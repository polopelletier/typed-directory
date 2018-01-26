import Animal from "../content/Animal";

import _domestic_Cat from "../content/animals/domestic/Cat";
import _domestic_Dog from "../content/animals/domestic/Dog";
import _zoo_Lion from "../content/animals/zoo/Lion";

const domestic_Cat:Animal = _domestic_Cat;
const domestic_Dog:Animal = _domestic_Dog;
const zoo_Lion:Animal = _zoo_Lion;

export default {
	"domestic": {
		"Cat": domestic_Cat,
		"Dog": domestic_Dog
	},
	"zoo": {
		"Lion": zoo_Lion
	}
};