// This code snippet checks the IBAN validity
// The algorithm taken from:
// https://en.wikipedia.org/wiki/International_Bank_Account_Number#Modulo_operation_on_IBAN

const strip = iban => iban.toUpperCase().replace(/\s+/g, '');

const sanityChecksPass = iban => {
    return ( iban
        && (typeof iban === 'string')
        && iban.length > 5
        && /^[0-9A-Za-z\s]*$/.test( iban )
    );
};

const modulo97 = (reminder, value) => {
    if( value.length === 0 ) {
        return reminder;
    } else {
        const b = parseInt('' + reminder + value.substring(0, 1));
        const r = b % 97;
        return modulo97( r, value.substring(1) );
    }
};

const digitsToInteger = digits => {
    const [c9, c0, cA] = ['9'.charCodeAt(0), '0'.charCodeAt(0), 'A'.charCodeAt(0)];
    const chars = [...digits];
    return chars
        .map( function (c) { return c.charCodeAt(0); } )
        .map( function (c) { return c > c9 ? c - cA + 10 : c - c0; })
        .map( function (i) { return i.toString(); })
        .join('');
};

const swap4digits = iban => {
    const prefix = iban.substring(0, 4);
    const suffix = iban.substring(4);
    return suffix + prefix;
};

const ibanIsValid = iban => {
    if( sanityChecksPass( iban ) ) {
        return 1 === modulo97( 0, digitsToInteger(swap4digits(strip( iban ))));
    } else {
        return false;
    }
};

module.exports = ibanIsValid;
