import RomanReader from "./roman-reader"
import { T, Chars, UnicodeIndexes } from "./chars";
import { walk as zimmerframeWalk } from 'zimmerframe';
import { Parser } from "./parser";


const toChar = (code) => String.fromCharCode(code)

function translateConsonant(node: Element): string {
    const char_index = Chars[T.CONSONANT].indexOf(node.data);
    return toChar(char_index + UnicodeIndexes[T.CONSONANT]);
}

export function convert(source_text: string) {
    const parser = new Parser(new RomanReader(source_text));
    const ast = parser.run() as Element[];
    return ast
        .map((element) => walk(element))
        .join('')
}

function walk(element: Element | null | undefined): any {
    return zimmerframeWalk(element, null, {
        _(node: Element, { next }) {
            next();
        },
        [T.SYLLABLE](node: Element, { visit }): string {
            return node.children.map(child_node => visit(child_node)).join('') || '';
        },
        [T.VOWEL](node: Element): string {
            return toChar(Chars[T.VOWEL].indexOf(node.data) + UnicodeIndexes[T.VOWEL]);
        },
        [T.CONSONANT]: translateConsonant,
        [T.INFIX](node: Element): string {
            const af_idx = Chars[T.INFIX].indexOf(node.data);
            return toChar(af_idx + UnicodeIndexes[T.INFIX]);
        },
        [T.SUFFIX](node: Element): string {
            const af_idx = Chars[T.SUFFIX].indexOf(node.data);
            return toChar(af_idx + UnicodeIndexes[T.SUFFIX]);
        },
        [T.SUFFIX_CONSONANT](node: Element): string {
            return translateConsonant(node) + toChar(UnicodeIndexes[T.SUFFIX_CONSONANT]);
        },
        [T.DIACRITIC_VOWEL](node: Element): string {
            const v_idx = Chars[T.VOWEL].indexOf(node.data);
            return toChar(v_idx + UnicodeIndexes[T.DIACRITIC_VOWEL]);
        },
        [T.DEFAULT_VOWEL](node: Element) {
            return { toString: () => '' };
        },
        [T.BINDU_KA](node: Element): string {
            return toChar(UnicodeIndexes[T.BINDU_KA]);
        },
        [T.UNKNOWN](node: Element) {
            return node.data;
        },
    });
}