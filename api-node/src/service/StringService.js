class StringService {
    /**
     * Replaces text content (i.e. text, template), with the given replacements
     * The replacements is an array of key value objects
     * [{ replacement_1: "day" },{ replacement_2: "awesome" }, ...]
     * The content may contain a set of replacements keys, that should match the
     * keys in the array of replacements
     * e.g. "The replacement_1 is replacement_2"
     *
     * @param {String} content the content which has text to be replaced
     * @param {Array} replacements an array of key/values that will be replaced
     *                   in the content
     * @return {String} The returned value is the subject with the replacements
     *                   applied ("The day is awesome")
     */
    replace(content, replacements) {
        let resultText = content;
        for (let i = 0; i < replacements.length; i++) {
            resultText = resultText.replace(
                new RegExp(Object.keys(replacements[i])[0], 'g'),
                Object.values(replacements[i])[0]
            );
        }
        return resultText;
    }
};
module.exports = StringService;
