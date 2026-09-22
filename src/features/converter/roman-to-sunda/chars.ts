export const T = {
  VOWEL: 'vowel',
  DEFAULT_VOWEL: 'default-vowel',
  DIACRITIC_VOWEL: 'diacritic-vowel',
  CONSONANT: 'consonant',
  SUFFIX_CONSONANT: 'suffix-consonant',
  INFIX: 'infix',
  SUFFIX: 'suffix',
  SYLLABLE: 'syllable',
  PAMAEH: 'pamaeh',
  NUMBER: 'number',
  UNKNOWN: 'unknown',
  BINDU_KA: 'bindu-ka',
};

export const UnicodeIndexes = {
  [T.NUMBER]: 7088,
  [T.CONSONANT]: 7050,
  [T.VOWEL]: 7043,
  [T.DIACRITIC_VOWEL]: 7075,
  [T.INFIX]: 7073,
  [T.SUFFIX]: 7040,
  [T.SUFFIX_CONSONANT]: 7082,
  [T.BINDU_KA]: 0x1CC5,
}

const CHR_0 = 48
const CHR_9 = 57
const CHR_A = 65
const CHR_Z = 90

export const Chars = {
  isAllowed(ch) {
    return (ch >= CHR_0 && ch <= CHR_9)
      || (ch >= CHR_A && ch <= CHR_Z)
      || (ch >= CHR_A + 32 && ch <= CHR_Z + 32)
      || (ch >= 200 && ch <= 203)
      || (ch >= 232 && ch <= 235)
      || (ch >= 274 && ch <= 279)
      || [282, 283, 516, 519, 904, 941, 34, 39].includes(ch)
  }
}
Chars[T.CONSONANT] = 'kqg-cjz-tdnpfvbmyrlwsxh'.split('');
Chars[T.CONSONANT][3] = 'ng';
Chars[T.CONSONANT][7] = 'ny';
Chars[T.CONSONANT][36] = 'kh';
Chars[T.CONSONANT][37] = 'sy';
Chars[T.SUFFIX_CONSONANT] = Chars[T.CONSONANT];

Chars[T.SUFFIX] = ['ng', 'r', 'h'];
Chars[T.INFIX] = ['y', 'r', 'l'];
Chars[T.INFIX][11] = 'm';
Chars[T.INFIX][12] = 'w';
Chars[T.BINDU_KA] = ['"', "'"];

Chars[T.VOWEL] = [...'aiu\u00e9oe'.split(''), 'eu'];
Chars[T.DIACRITIC_VOWEL] = Chars[T.VOWEL]
Chars[T.DEFAULT_VOWEL] = 'a';
Chars[T.NUMBER] = {
  includes(num, code = 0) {
    code = num.charCodeAt()
    return code > 47 && code < 58
  }
};
Chars[T.UNKNOWN] = {
  includes(chars: string) {
    return !Chars.isAllowed(chars.charCodeAt(0))
  }
};
