let SYMBOL = '*';



function createBoxedText(index, text, symbol, maxLength) {
    const padding = 4;
    const boxWidth = maxLength + padding * 2;
    let border = symbol.repeat(boxWidth);
    if (symbol === '|') {
        border = '-'.repeat(boxWidth);
    }

    // Truncate text if it exceeds maxLength
    const truncatedText = text.length > maxLength ? text.slice(0, maxLength) : text;
    // Center the text
    const centeredText = `${symbol} ${truncatedText.padStart((boxWidth - 3 + truncatedText.length) / 2).padEnd(boxWidth - 3)} ${symbol}`;
    return `${index === 0 ? border+'\n' : '\n'}${centeredText}\n${border}`;
}

function convertirLista() {
    const rawText = $(this).val();
    let lines = rawText.split('\n');
    console.log(lines);
    let sizes = [];
    // Get the visible character width of the textarea for dynamic maxLength adjustment
    const visibleWidth = $(this).width();
    const approxCharWidth = 7; // Approximate pixel width of a character
    const maxLength = Math.floor(visibleWidth / approxCharWidth) - 12; // Adjust for padding and symbols

    let filteredList = lines.filter(line => {
        sizes.push(Math.min(line.length, maxLength));
        return line.length > 0;
    });
    
    let listaComentada = '';
    if ($('select#idBordes').val() === "4") SYMBOL = $('input[name="personalizado"]').val();
    filteredList.forEach((line, index) => {
        listaComentada += createBoxedText(index, line, SYMBOL, maxLength);
    });
    $('#idComentada').val(listaComentada);
}

function copyListResult() {
    const textToCopy = $('#idComentada').val();
    navigator.clipboard.writeText(textToCopy).then(() => {
        $('#copyMessage').fadeIn(300).delay(1000).fadeOut(300);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}



$(function() {
    SYMBOL = $('select#idBordes').val();
    $('#idSimple').on('input', convertirLista);

    $('.btnCopy').on('click', copyListResult);


    $('input[name="personalizado"]').on('input', function() {
        $('#idSimple').trigger('input');
    });
    

    $('select#idBordes').on('change', function() {
       const sign = $(this).val();
        $('input[name="personalizado"]').css('opacity', sign === '4' ? 1 : 0);
        SYMBOL = $(this).val();
        $('#idSimple').trigger('input');
    });

});