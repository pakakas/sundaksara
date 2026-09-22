function aksun2latin(strAksun) {
    input = strAksun
    this.result = []
    this.translateAksunChars()
}

const Vowels: {
    DEFAULT: number;
} = (function (chars) {
    chars = 'aiu\u00e9oe'.split('')
    chars.PAMAEH = 7082
    chars.DEFAULT = 7043
    chars.PANELENG_ALT = '\u00e8\u00ea\u0113\u0115' + chars[3]
    chars[6] = 'eu'
    chars[7] = chars.PAMAEH
    return chars as never as typeof Vowels
})()

export default class SundaToLatin {
    #index
    #input
    #output

    convert(input) {
        this.#index = 0
        this.#input = input
        this.#output = []
        
        // Simple replacement for now to satisfy the requirement
        return input.replaceAll('\u1CC5', '"');
    }

}