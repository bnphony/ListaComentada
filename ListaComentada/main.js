let SYMBOL = '*';
let resizeTimeout;
const SIZES = [[800, 300], [360, 440]];

function createBoxedText(index, text, symbol, maxLength) {
    const padding = 4;
    maxLength -= 4;
    const boxWidth = maxLength + padding * 2;
    const isEnumerated = $('input[name="enumerar"]').prop('checked');
    let borderBoxWidth = isEnumerated ? boxWidth + 3 : boxWidth;
    let border = symbol === '|' ? '-'.repeat(borderBoxWidth) : symbol.repeat(borderBoxWidth);
    const indexWidth = isEnumerated ? index.toString().length : 0;
    const labelMargin = indexWidth + 3; // 3 spaces for padding

    // Split text into chunks based on maxLength
    const textChunks = [];
    while (text.length > 0) {
        textChunks.push(text.slice(0, maxLength));
        text = text.slice(maxLength);
    }

    // Generate each line
    const totalText = textChunks.map((chunk, i) => {
        const isMiddleLine = i === Math.floor(textChunks.length / 2);
        const nDigits = index + 1 < 10 ? 3 : 4;
        const label = isEnumerated && isMiddleLine 
            ? `${index + 1} ${symbol}`.padEnd(labelMargin) : isEnumerated 
            ? `${symbol}`.padStart(nDigits).padEnd(labelMargin) : '';
        const centeredText = chunk.padStart((boxWidth - labelMargin) / 2 + chunk.length / 2).padEnd(boxWidth - labelMargin);
        return `${symbol} ${label}${centeredText} ${symbol}`;
    }).join('\n');

    return `${index === 0 ? border + '\n' : '\n'}${totalText}\n${border}`;
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


function changeTextAreaSize() {
    const value = parseInt($(this).val());
    
    // Check if the value is valid and not equal to -1
    if (value !== -1 && !isNaN(value)) {
        const [width, height] = SIZES[value]; // Destructure the width and height

        // Set the dimensions of the textarea
        $('#idSimple').css({ width, height }).trigger('input');
    }
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


    $('select#idSizes').on('change', changeTextAreaSize);
    $('select#idSizes').val('-1');
});