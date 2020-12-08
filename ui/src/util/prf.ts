export function getExpandedQuery(originalQuery: string, results: string[]): string {
    const dictionary = [] as string[];
    results.forEach(result => {
        const words = result.split(" ");
        words.forEach(word => {
            const term = word.replaceAll(/[^0-9a-z]/gi, "").toLowerCase();
            dictionary.push(term);
        });
    });

    // Compute frequencies
    const n = results.length;
    const terms = [] as {word: string, f: number}[];

    dictionary.forEach(word => {
        let docFreq = 0;
        results.forEach(result => {
            const sanitized = result.replaceAll(/[^0-9a-z ]/gi, "")
                .toLowerCase();
            if (sanitized.includes(word)) {
                docFreq++
            }
        });
        const tf = n / (1 + docFreq);
        const idf = Math.log(tf);
        terms.push({
            word: word,
            f: tf * idf
        });
    });

    terms.sort((a, b) => b.f - a.f);
    const expansion = terms.slice(0, 5).map(it => it.word);
    return `${originalQuery} ${expansion}`;
}