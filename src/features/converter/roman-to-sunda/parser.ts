import { Chars, T } from "./chars";
import { Parser as BaseParser } from "../parser/parser";
import Token from "../parser/token";
import RomanReader from "./roman-reader";


export class Parser extends BaseParser {
    #reader: RomanReader
    #last: Token

    parse(reader: RomanReader) {
        this.#reader = reader
        this.#last = new Token('', Chars)

        while (!reader.eof) {
            this.#parseToken(reader.read());
        }
    }

    #parseToken(current: Token) {
        if (current.is(T.CONSONANT)) {
            return this.#parseConsonant(current);
        }

        if (current.is(T.VOWEL)) {
            return this.#parseVowel(current);
        }

        if (current.is(T.NUMBER)) {
            return this.append(current)
        }

        if (current.is(T.BINDU_KA)) {
            this.#exitSyllable()
            return this.append(current.as(T.BINDU_KA))
        }

        this.#appendUnknown(current)
    }

    #parseVowel(current: Token) {
        if (this.#last.is_empty) {
            this.#enterSyllable()
            return this.append(current.as(T.VOWEL))
        }

        if (this.#last.is(T.VOWEL, T.UNKNOWN)) {
            this.#renewSyllable()
            return this.append(current.as(T.VOWEL))
        }

        this.append(current.asOneOf(T.DEFAULT_VOWEL, T.DIACRITIC_VOWEL))
    }

    #parseConsonant(current: Token, prev?: Token) {
        let last = this.#last
        let next = this.#reader.next

        if (next.is_empty) { // cases: ang.ru(k) | pang.(r)
            current.type = T.SUFFIX_CONSONANT

            if (current.is(T.SUFFIX) && last.is(T.DEFAULT_VOWEL, T.DIACRITIC_VOWEL)) {
                current.type = T.SUFFIX
            }

            this.append(current)
            return this.#exitSyllable()
        }

        // cases: p(r)ang | ka.(r)ak.ter | a.ya.(k)an | a.<space>.(l)é
        if (next.is(T.VOWEL)) {

            // cases: p(r)ang | ka.(r)ak.ter
            if (current.is(T.INFIX) && last.is(T.CONSONANT)) {
                if (last.is(T.VOWEL)) {
                    this.#renewSyllable()
                    return this.append(current.as(T.CONSONANT))
                }

                return this.append(current.as(T.INFIX))
            }

            // cases: a.ya.(k)an
            if (current.is(T.SUFFIX) || !last.is_empty) {
                this.#renewSyllable()
            }
            else if (last.is_empty || last.is(T.UNKNOWN)) {
                this.#enterSyllable()
            }

            return this.append(current.as(T.CONSONANT))
        }

        // cases: pa(ng).r | pa.(ng)ra.ngo | pa.ngra.(ng)o | ka.ra.(p)yak | 'a(k).<space>.ing'
        if (last.is(T.VOWEL)) {
            next = this.#reader.read()
            const next2 = this.#reader.next

            if (next2.is_empty) { // case pa(ng).r
                this.append(current.asOneOf(T.SUFFIX, T.SUFFIX_CONSONANT))
                next.is(T.UNKNOWN) ? this.#exitSyllable() : this.#renewSyllable()
            }
            else if (next.is(T.INFIX)) { // cases: pa.(ng)ra.ngo | ka.ra.(p)yak
                this.#renewSyllable()
                this.append(current.as(T.CONSONANT))
            }
            else if (next.is(T.VOWEL)) { // cases: pa.ngra.(ng)o
                this.append(current.as(T.CONSONANT))
                return this.#parseVowel(next)
            }
            else {
                this.append(current.asOneOf(T.SUFFIX, T.SUFFIX_CONSONANT))
            }

            return this.#parseToken(next)
        }

        if (last.is_empty) {
            this.#enterSyllable()
            return this.append(current.as(T.CONSONANT))
        }
    }

    #appendUnknown(token: Token) {
        this.#exitSyllable()
        this.append(token.as(T.UNKNOWN))
    }

    #enterSyllable() {
        this.push({ type: T.SYLLABLE })
    }

    #renewSyllable() {
        this.pop()
        this.push({ type: T.SYLLABLE })
    }

    #exitSyllable() {
        this.pop()
    }

    append(element: Token): void {
        this.#last = element
        super.append(element)
    }
}
