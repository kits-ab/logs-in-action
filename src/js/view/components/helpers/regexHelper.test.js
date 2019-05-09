import {
  groupByMatches,
  isEscapedRegexString,
  escapeRegexString,
  parseRegex
} from './regexHelper';

describe('groupByMatches', () => {
  it('should match the whole string', () => {
    const string = 'The quick brown fox jumps over the lazy dog.';
    const regex = /./;
    const expectedResult = [{ matched: true, text: string }];

    expect(groupByMatches(string, regex)).toEqual(expectedResult);
  });

  it('should group adjacent matches in string', () => {
    const stringArray = ['bbbbbbbb', 'aba', 'bbbbb', 'aba', 'bbbb'];
    const string = stringArray.join('');
    const regex = /a.a/;
    const expectedResult = [
      { matched: false, text: stringArray[0] },
      { matched: true, text: stringArray[1] },
      { matched: false, text: stringArray[2] },
      { matched: true, text: stringArray[3] },
      { matched: false, text: stringArray[4] }
    ];

    expect(groupByMatches(string, regex)).toEqual(expectedResult);
  });

  it('should be able to handle empty string', () => {
    const string = '';
    const regex = /.*/;
    const expectedResult = [];

    expect(groupByMatches(string, regex)).toEqual(expectedResult);
  });

  it('should be able to handle no matches', () => {
    const string = 'bbbbbbbbbbbbbbbbbbb';
    const regex = /a/;
    const expectedResult = [{ matched: false, text: string }];

    expect(groupByMatches(string, regex)).toEqual(expectedResult);
  });
});

describe('isEscapedRegexString', () => {
  it('should show as escaped regex string when starting string with escape sequence', () => {
    const string = '@helloimnormaltext';
    const escapeSequence = '@';

    expect(isEscapedRegexString(string, escapeSequence)).toEqual(true);
  });

  it('should not show as escaped regex string on empty escape sequence', () => {
    const string = 'helloimnormaltext';
    const escapeSequence = '';

    expect(!!isEscapedRegexString(string, escapeSequence)).toEqual(false);
  });

  it('should not show as escaped regex string on wrong escape sequence', () => {
    const string = '@helloimnormaltext';
    const escapeSequence = '%';

    expect(isEscapedRegexString(string, escapeSequence)).toEqual(false);
  });
});

describe('escapeRegexString', () => {
  it('should escape regex characters and remove escapeSequence', () => {
    const string = '@. \\ + * ? [ ^ ] $ ( ) { } = ! < > | : -';
    const escapeSequence = '@';
    const expectedResult =
      '\\. \\\\ \\+ \\* \\? \\[ \\^ \\] \\$ \\( \\) \\{ \\} \\= \\! \\< \\> \\| \\: \\-';

    expect(escapeRegexString(string, escapeSequence)).toEqual(expectedResult);
  });
});

describe('parseRegex', () => {
  it('should fail to create regex when supplied a faulty regex', () => {
    const string = '\\';
    const escapeSequence = '@';
    const expectedResult = undefined;

    expect(parseRegex(string, escapeSequence)).toEqual(expectedResult);
  });

  it('should succeed to create regex when supplied a simple regex', () => {
    const string = 'asdSDFASDFnvnio';
    const expectedResult = /asdSDFASDFnvnio/i;

    expect(parseRegex(string, undefined)).toEqual(expectedResult);
  });

  it('should succeed to create regex when supplied an escaped faulty regex', () => {
    const string = '@\\';
    const escapeSequence = '@';
    const expectedResult = /\\/i;

    expect(parseRegex(string, escapeSequence)).toEqual(expectedResult);
  });

  it('should be case insensitive', () => {
    const string = 'a';
    const expectedResult = /a/i;

    expect(parseRegex(string, undefined)).toEqual(expectedResult);
  });

  it('should fail to create regex when supplied an empty string', () => {
    const string = '';
    const expectedResult = undefined;

    expect(parseRegex(string, undefined)).toEqual(expectedResult);
  });

  it('should fail to create regex when supplied only the escape sequence', () => {
    const string = '@';
    const escapeSequence = '@';
    const expectedResult = undefined;

    expect(parseRegex(string, escapeSequence)).toEqual(expectedResult);
  });
});
