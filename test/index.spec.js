const typedDirectory = requireSrc("index");

describe("typedDirectory", function(){
	describe("generateContent", function(){
		const generateContent = typedDirectory.generateContent;

		it("Is a function", function(){
			assert.isFunction(generateContent)
		});
	});
});