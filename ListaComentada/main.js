let SYMBOL = '*';
let resizeTimeout;


function createBoxedText(index, text, symbol, maxLength) {
    const padding = 4;
    let margin = 3;
    const boxWidth = maxLength + padding * 2;
    let border = symbol.repeat(boxWidth);
    if (symbol === '|') {
        border = '-'.repeat(boxWidth);
    }
    // maxLength = Math.floor(maxLength * 0.9);
    // Truncate text if it exceeds maxLength
    const truncatedText = text.length > maxLength ? text.slice(0, maxLength) : text;
    // Center the text
    
    let centeredText = `${symbol} ${truncatedText.padStart((boxWidth - margin + truncatedText.length) / 2).padEnd(boxWidth - margin)} ${symbol}`;
    if ($('input[name="enumerar"]').prop('checked')) {
        margin = 6;
        centeredText = `${symbol} ${index+1} ${symbol} ${truncatedText.padStart((boxWidth - margin + truncatedText.length) / 2).padEnd(boxWidth - margin)} ${symbol}`;
    }
    return `${index === 0 ? border+'\n' : '\n'}${centeredText}\n${border}`;
}

function convertirLista() {
    const rawText = $(this).val();
    let lines = rawText.split('\n');
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

function syncResizeTextarea() {
    // Capture the dimensions of the first textarea
    const height1 = $('#idSimple').outerHeight();
    const width1 = $('#idSimple').outerWidth();

    $('#idComentada').height(height1);
    $('#idComentada').width(width1); 
}



$(function() {
    SYMBOL = $('select#idBordes').val();
    $('#idSimple').on('input', convertirLista);

    $('.btnCopy').on('click', copyListResult);


    $('input[name="personalizado"]').on('input', function() {
        $('#idSimple').trigger('input');
    });

    $('input[name="enumerar"]').on('change', function() {
        $('#idSimple').trigger('input');
    });
    

    $('select#idBordes').on('change', function() {
       const sign = $(this).val();
        $('input[name="personalizado"]').css('opacity', sign === '4' ? 1 : 0);
        SYMBOL = $(this).val();
        $('#idSimple').trigger('input');
    });


    $('#idSimple, #idComentada').on('resize', syncResizeTextarea);

    
    
    const $tArea1 = document.getElementById('idSimple');
    new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(syncResizeTextarea, 200); // Cambia el 100 a lo que mejor funcione en tu caso
    }).observe($tArea1);
    syncResizeTextarea();

});