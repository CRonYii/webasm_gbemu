mergeInto(LibraryManager.library, {
    print_error_js: function (msg_ptr) {
        const buf = [];
        while (HEAPU8[msg_ptr] !== 0) {
            buf.push(HEAPU8[msg_ptr++]);
        }
        const msg = buf.map(code => String.fromCharCode(code)).join('');
        console.error(msg);
        if (window.print_error) {
            window.print_error(msg);
        }
    },
});